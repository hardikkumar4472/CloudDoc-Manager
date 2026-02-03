import { createClient } from "@supabase/supabase-js";
import Document from "../models/Document.js";
import sharp from "sharp"; 
import crypto from "crypto";
import jsPDF from "jspdf";
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { sendMail } from "../services/sendEmail.js";
import archiver from "archiver";
import * as aiService from "../services/ai.service.js";
import mongoose from "mongoose";
import Log from "../models/Log.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY 
);

export const generateShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresIn } = req.body;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (doc.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized to share this document" });
    }
    const token = crypto.randomBytes(16).toString("hex");
    const expiry = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;
    doc.shareToken = token;
    doc.shareExpiry = expiry;
    await doc.save();
    res.json({
      message: "Share link created",
      shareUrl: `${process.env.FRONTEND_URL}/share/${token}`,
      expiresAt: expiry,
    });
  } catch (err) {
    console.error("Share link error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const accessSharedFile = async (req, res) => {
  try {
    const { token } = req.params;
    const doc = await Document.findOne({ shareToken: token });

    if (!doc) return res.status(404).json({ message: "Invalid or expired link" });

    if (doc.shareExpiry && new Date() > doc.shareExpiry) {
      return res.status(403).json({ message: "Link expired" });
    }

    res.json({ document: doc });
  } catch (err) {
    console.error("Access shared file error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const revokeShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findOne({ _id: id, uploadedBy: req.userId });
    if (!doc) return res.status(404).json({ message: "Document not found" });
    if (doc.uploadedBy.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to revoke link" });
    }

    doc.shareToken = null;
    doc.shareExpiry = null;
    await doc.save();

    res.json({ message: "Share link revoked successfully" });
  } catch (err) {
    console.error("Revoke link error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `clouddocs/${fileName}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) throw error;
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);

    let textContent = "";
    if (fileExt.toLowerCase() === "pdf") {
      try {
        const pdf = await import('pdf-parse');
        
        const { data: fileData, error: downloadError } = await supabase.storage
          .from("documents")
          .download(filePath);

        if (!downloadError && fileData) {
          const buffer = Buffer.from(await fileData.arrayBuffer());
          const pdfData = await pdf.default(buffer);
          textContent = pdfData.text;
        }
      } catch (pdfError) {
        console.error("Error extracting PDF text:", pdfError);
      }
    }

    const doc = new Document({
      filename: req.file.originalname,
      url: data.publicUrl,
      public_id: filePath,
      uploadedBy: req.userId,
      size: req.file.size,
      type: req.file.mimetype,
      textContent, 
    });

    // Generate AI processing in background (don't block response)
    (async () => {
        try {
            const buffer = req.file.buffer;
            
            // Generate Tags, Summary and OCR in parallel
            const [tags, summary] = await Promise.all([
                aiService.autoTagDocument(doc.filename, buffer, doc.type),
                aiService.summarizeDocument(buffer, doc.type)
            ]);

            doc.tags = tags;
            doc.summary = summary;

            if (doc.type.startsWith("image/")) {
                doc.ocrText = await aiService.performOCR(buffer);
            }
            
            await doc.save();
        } catch (err) {
            console.error("Background AI failed:", err);
        }
    })();

    await doc.save();

    // Log upload
    await Log.create({
        userId: req.userId,
        documentId: doc._id,
        action: "UPLOAD",
        details: `Uploaded ${doc.filename}`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
    });

    res.status(201).json({ msg: "File uploaded successfully", document: doc });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ msg: "Error uploading file", error: error.message });
  }
};
export const getFiles = async (req, res) => {
  try {
    const { vault, trash } = req.query;
    const query = { uploadedBy: req.userId };

    // Handle Vault/Trash Visibility
    if (trash === 'true') {
      query.isTrashed = true;
    } else {
      query.isTrashed = { $ne: true };
      if (vault === 'true') {
        query.isVault = true;
      } else {
        query.isVault = { $ne: true };
      }
    }

    // Handle Expiry: Exclude files that have expired
    query.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];

    const docs = await Document.find(query)
      .sort({ isPinned: -1, createdAt: -1 }); // Pinned first, then newest
    res.json(docs);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching documents", error: error.message });
  }
};
export const deleteFile = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });
    const { error } = await supabase.storage
      .from("documents")
      .remove([doc.public_id]);

    if (error) throw error;

    await doc.deleteOne();
    res.json({ msg: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ msg: "Error deleting document", error: error.message });
  }
};
export const viewFile = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    res.redirect(doc.url);
  } catch (error) {
    console.error("Error viewing file:", error);
    res.status(500).json({ msg: "Error viewing document", error: error.message });
  }
};
export const resizeImageDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const { width, height, quality } = req.query;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });
    if (!doc.type.startsWith('image/')) {
      return res.status(400).json({ msg: "File is not an image" });
    }
    const { data, error } = await supabase.storage
      .from("documents")
      .download(doc.public_id);
    if (error) throw error;
    let transformer = sharp(await data.arrayBuffer());
    if (width || height) {
      transformer = transformer.resize(
        width ? parseInt(width) : null,
        height ? parseInt(height) : null,
        { fit: "inside" }
      );
    }
    if (quality) {
      transformer = transformer.jpeg({ quality: parseInt(quality) });
    }

    const buffer = await transformer.toBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="resized-${doc.filename}"`
    );
    res.setHeader("Content-Type", "image/jpeg");

    res.send(buffer);
  } catch (error) {
    console.error("Error resizing image:", error);
    res.status(500).json({ msg: "Error resizing image", error: error.message });
  }
};
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ msg: "Document not found" });
    }

    doc.isFavorite = !doc.isFavorite;
    await doc.save();

    res.json({ msg: "Favorite status updated", isFavorite: doc.isFavorite });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ msg: "Error toggling favorite", error: error.message });
  }
};
export const togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ msg: "Document not found" });
    }

    doc.isPinned = !doc.isPinned;
    await doc.save();

    res.json({ msg: "Pin status updated", isPinned: doc.isPinned });
  } catch (error) {
    console.error("Error toggling pin:", error);
    res.status(500).json({ msg: "Error toggling pin", error: error.message });
  }
};
export const uploadNewVersion = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = `clouddocs/${fileName}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) throw error;
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    const newVersionNumber = (doc.versions?.length || 0) + 1;
    doc.versions.push({
      versionNumber: newVersionNumber,
      fileUrl: data.publicUrl,
      uploadedAt: new Date(),
    });
    doc.url = data.publicUrl;
    doc.updatedAt = new Date();
    await doc.save();
    res.json({ msg: "New version uploaded", document: doc });
  } catch (error) {
    console.error("Error uploading new version:", error);
    res.status(500).json({ msg: "Error uploading new version", error: error.message });
  }
};

export const restoreVersion = async (req, res) => {
  try {
    const { id, versionNumber } = req.params;
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });
    const version = doc.versions.find(v => v.versionNumber == versionNumber);
    if (!version) return res.status(404).json({ msg: "Version not found" });
    doc.url = version.fileUrl;
    doc.updatedAt = new Date();
    const newVersionNumber = (doc.versions?.length || 0) + 1;
    doc.versions.push({
      versionNumber: newVersionNumber,
      fileUrl: version.fileUrl,
      uploadedAt: new Date(),
      isRestorePoint: true,
      restoredFrom: versionNumber
    });

    await doc.save();

    res.json({ msg: `Restored to version ${versionNumber}`, document: doc });
  } catch (error) {
    console.error("Error restoring version:", error);
    res.status(500).json({ msg: "Error restoring version", error: error.message });
  }
};
export const searchFiles = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    let docs;
    try {
      docs = await Document.find(
        { 
          $text: { $search: query }, 
          uploadedBy: req.userId 
        },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    } catch (error) {
      docs = await Document.find({
        filename: { $regex: query, $options: 'i' },
        uploadedBy: req.userId
      }).sort({ createdAt: -1 });
    }

    res.json(docs);
  } catch (error) {
    console.error("Error searching documents:", error);
    res.status(500).json({ msg: "Error searching documents", error: error.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }
    const { data, error } = await supabase.storage
      .from("documents")
      .download(doc.public_id);

    if (error) {
      console.error("Supabase download error:", error.message);
      return res.status(500).json({ message: "Error downloading file" });
    }
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${doc.filename}"`
    );
    res.setHeader("Content-Type", doc.type || "application/octet-stream");
    const buffer = Buffer.from(await data.arrayBuffer());

    // Log download
    await Log.create({
        userId: req.userId || null,
        documentId: id,
        action: "DOWNLOAD",
        details: `Downloaded ${doc.filename}`,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
    });

    res.send(buffer);
  } catch (err) {
    console.error("Download controller error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const renameDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;

    if (!newName || newName.trim() === "") {
      return res.status(400).json({ message: "New filename is required" });
    }

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.filename = newName;
    await doc.save();

    res.status(200).json({
      message: "Filename updated successfully",
      document: doc,
    });
  } catch (err) {
    console.error("Rename error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadImageAsPDF = async (file) => {
  try {
    if (!file.url || !file.type.startsWith("image/")) {
      alert("This feature is only available for images.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = file.url;

    img.onload = () => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; 
      const imgHeight = (img.height * imgWidth) / img.width; // scale aspect ratio

      pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${file.filename}.pdf`);
    };
  } catch (error) {
    console.error("Error converting image to PDF:", error);
  }
};


export const sendDocumentAsAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { to, subject, message } = req.body;
    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Document not found" });
    }
    const attachments = [
      {
        filename: doc.filename || `document-${Date.now()}`, // ✅ use schema field
        path: doc.url
      }
    ];
    const result = await sendMail({
      to,
      subject: subject || "Shared Document",
      text: message || "Please find the attached document.",
      attachments
    });

    if (result.success) {
      res.json({ success: true, message: "Document sent successfully" });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (err) {
    console.error("Send document error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const compressPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const { level } = req.query;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    if (!doc.type.includes("pdf")) {
      return res.status(400).json({ msg: "File is not a PDF" });
    }

    const { data, error } = await supabase.storage
      .from("documents")
      .download(doc.public_id);

    if (error) throw error;

    const buffer = Buffer.from(await data.arrayBuffer());
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(buffer);
    
    // Create a new PDF to strip metadata/unused objects
    const compressedDoc = await PDFDocument.create();
    
    // Copy all pages
    const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach((page) => compressedDoc.addPage(page));

    // Set minimal metadata
    compressedDoc.setTitle(doc.filename);
    compressedDoc.setProducer('CloudDoc Manager');
    compressedDoc.setCreator('CloudDoc Manager');

    // Save with object streams (lossless compression)
    const compressedPDF = await compressedDoc.save({
      useObjectStreams: true,
      compress: true,
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="compressed-${level}-${doc.filename}"`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(compressedPDF));

  } catch (err) {
    console.error("PDF compression error:", err);
    res.status(500).json({ 
      msg: "Error compressing PDF. Aggressive compression requires server-side tools.", 
      error: err.message 
    });
  }
};

// --- PDF Features ---

export const mergePDFs = async (req, res) => {
  try {
    const { docIds } = req.body; // Array of IDs in order
    if (!docIds || !docIds.length) return res.status(400).json({ msg: "No documents selected" });

    const mergedPdf = await PDFDocument.create();

    for (const id of docIds) {
      const doc = await Document.findById(id);
      if (!doc) continue;

      const { data, error } = await supabase.storage.from("documents").download(doc.public_id);
      if (error) continue;

      const buffer = Buffer.from(await data.arrayBuffer());
      const pdf = await PDFDocument.load(buffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    
    res.setHeader("Content-Disposition", 'attachment; filename="merged-document.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ msg: "Error merging PDFs", error: error.message });
  }
};

export const splitPDF = async (req, res) => {
    try {
      const { id } = req.params;
      const { ranges } = req.body; // e.g. "1-3, 5, 8-10"
  
      const doc = await Document.findById(id);
      if (!doc) return res.status(404).json({ msg: "Document not found" });
  
      const { data, error } = await supabase.storage.from("documents").download(doc.public_id);
      if (error) throw error;
  
      const pdfDoc = await PDFDocument.load(Buffer.from(await data.arrayBuffer()));
      const newPdf = await PDFDocument.create();
      const pageCount = pdfDoc.getPageCount();
      
      const pageIndices = new Set();

      const parts = ranges.split(',').map(p => p.trim()).filter(Boolean);
      
      for (const part of parts) {
          if (part.includes('-')) {
             const [startStr, endStr] = part.split('-').map(s => s.trim());
             const start = Math.max(0, parseInt(startStr) - 1);
             const end = Math.min(pageCount - 1, parseInt(endStr) - 1);
             if (!isNaN(start) && !isNaN(end) && start <= end) {
                 for(let i=start; i<=end; i++) pageIndices.add(i);
             }
          } else {
             const pageNum = parseInt(part);
             if (!isNaN(pageNum)) {
                 const idx = Math.max(0, Math.min(pageCount - 1, pageNum - 1));
                 pageIndices.add(idx);
             }
          }
      }

      const sortedIndices = Array.from(pageIndices).sort((a,b) => a - b);

      if(sortedIndices.length === 0) return res.status(400).json({ msg: "Invalid page range" });
  
      const copiedPages = await newPdf.copyPages(pdfDoc, sortedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));
  
      const pdfBytes = await newPdf.save();
      
      res.setHeader("Content-Disposition", `attachment; filename="split-${doc.filename}"`);
      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      res.status(500).json({ msg: "Error splitting PDF", error: error.message });
    }
  };

export const addWatermark = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        const { data } = await supabase.storage.from("documents").download(doc.public_id);
        const buffer = Buffer.from(await data.arrayBuffer());

        if (doc.type === "application/pdf") {
            const pdfDoc = await PDFDocument.load(buffer);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

            pages.forEach(page => {
                const { width, height } = page.getSize();
                page.drawText(text, {
                    x: width / 2 - 100,
                    y: height / 2,
                    size: 50,
                    font: font,
                    color: rgb(0.7, 0.7, 0.7),
                    rotate: degrees(45),
                    opacity: 0.5,
                });
            });

            const pdfBytes = await pdfDoc.save();
            res.setHeader("Content-Disposition", `attachment; filename="watermarked-${doc.filename}"`);
            res.setHeader("Content-Type", "application/pdf");
            res.send(Buffer.from(pdfBytes));
        } else if (doc.type.startsWith("image/")) {
             // Basic image watermark with SVG text
             const svgImage = `
             <svg width="500" height="100">
               <style>
                 .title { fill: rgba(255, 255, 255, 0.5); font-size: 48px; font-weight: bold; font-family: sans-serif; }
               </style>
               <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
             </svg>
             `;
             
             const data = await sharp(buffer)
                .composite([{ input: Buffer.from(svgImage), gravity: 'center' }])
                .toBuffer();
             
             res.setHeader("Content-Disposition", `attachment; filename="watermarked-${doc.filename}"`);
             res.setHeader("Content-Type", doc.type);
             res.send(data);
        } else {
            return res.status(400).json({ msg: "Unsupported file type for watermark" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error adding watermark", error: error.message });
    }
};

// --- Image Features ---

export const convertImageFormat = async (req, res) => {
    try {
        const { id } = req.params;
        const { format } = req.body; // 'webp', 'png', 'jpeg'

        const doc = await Document.findById(id);
        if (!doc.type.startsWith("image/")) return res.status(400).json({ msg: "Not an image" });

        const { data } = await supabase.storage.from("documents").download(doc.public_id);
        let pipeline = sharp(Buffer.from(await data.arrayBuffer()));

        if (format === 'webp') pipeline = pipeline.webp();
        else if (format === 'png') pipeline = pipeline.png();
        else if (format === 'jpeg') pipeline = pipeline.jpeg();

        const buffer = await pipeline.toBuffer();
        
        res.setHeader("Content-Disposition", `attachment; filename="converted.${format}"`);
        res.setHeader("Content-Type", `image/${format}`);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ msg: "Error converting image", error: error.message });
    }
};

export const cropImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { width, height, left, top } = req.body;

        const doc = await Document.findById(id);
        if (!doc.type.startsWith("image/")) return res.status(400).json({ msg: "Not an image" });

        const { data } = await supabase.storage.from("documents").download(doc.public_id);
        
        const buffer = await sharp(Buffer.from(await data.arrayBuffer()))
            .extract({ width: parseInt(width), height: parseInt(height), left: parseInt(left), top: parseInt(top) })
            .toBuffer();

        res.setHeader("Content-Disposition", `attachment; filename="cropped-${doc.filename}"`);
        res.setHeader("Content-Type", doc.type);
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ msg: "Error cropping image", error: error.message });
    }
};

// --- General Features ---

export const toggleVault = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        doc.isVault = !doc.isVault; // Toggle
        await doc.save();
        res.json({ msg: doc.isVault ? "Moved to Vault" : "Removed from Vault", isVault: doc.isVault });
    } catch (error) {
        res.status(500).json({ msg: "Error toggling vault", error: error.message });
    }
};

export const setFileExpiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { hours } = req.body; // Set expiry in X hours

        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        if (hours) {
            doc.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
        } else {
            doc.expiresAt = null; // Remove expiry
        }
        await doc.save();
        res.json({ msg: "Expiry updated", expiresAt: doc.expiresAt });
    } catch (error) {
        res.status(500).json({ msg: "Error setting expiry", error: error.message });
    }
};

export const downloadAllFiles = async (req, res) => {
    try {
        const docs = await Document.find({ uploadedBy: req.userId });
        
        console.log(`[Export] Found ${docs?.length || 0} documents for user ${req.userId}`);

        if (!docs || docs.length === 0) {
            return res.status(404).json({ msg: "No files found to export" });
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // Listen for errors
        archive.on('error', (err) => {
            console.error("[Export] Archiver error:", err);
            if (!res.headersSent) {
                res.status(500).send({ msg: "Error creating zip", error: err.message });
            }
        });

        const filename = `clouddoc-export-${Date.now()}.zip`;
        res.status(200);
        res.attachment(filename);
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        archive.pipe(res);

        for (const doc of docs) {
            try {
                console.log(`[Export] Adding file: ${doc.filename} (${doc.public_id})`);
                const { data, error } = await supabase.storage.from("documents").download(doc.public_id);
                if (error) {
                    console.error(`[Export] Supabase download error for ${doc.filename}:`, error);
                    continue;
                }
                if (data) {
                    const buffer = Buffer.from(await data.arrayBuffer());
                    archive.append(buffer, { name: doc.filename });
                }
            } catch (err) {
                console.error(`[Export] Failed to archive ${doc.filename}:`, err);
            }
        }

        // Listen for warnings (e.g. stat failures and other non-blocking errors)
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn("[Export] Archiver warning:", err);
            } else {
                console.error("[Export] Archiver warning err:", err);
            }
        });

        console.log("[Export] Finalizing archive...");
        await archive.finalize();
        console.log("[Export] Archive finalized.");

    } catch (error) {
        console.error("[Export] Global export error:", error);
        if (!res.headersSent) {
            res.status(500).json({ msg: "Error exporting files", error: error.message });
        }
    }
};

// AI Intelligence
export const summarizeDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        if (doc.summary) return res.json({ summary: doc.summary });

        const { data, error } = await supabase.storage.from("documents").download(doc.public_id);
        if (error) throw error;

        const buffer = Buffer.from(await data.arrayBuffer());
        const summary = await aiService.summarizeDocument(buffer, doc.type);
        
        doc.summary = summary;
        await doc.save();

        res.json({ summary });
    } catch (error) {
        res.status(500).json({ msg: "AI Summary failed", error: error.message });
    }
};

export const chatWithDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { question } = req.body;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        const { data, error } = await supabase.storage.from("documents").download(doc.public_id);
        if (error) throw error;

        const buffer = Buffer.from(await data.arrayBuffer());
        const answer = await aiService.chatWithDocument(buffer, doc.type, question);
        
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ msg: "AI Chat failed", error: error.message });
    }
};

export const autoTagDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        const { data, error } = await supabase.storage.from("documents").download(doc.public_id);
        if (error) throw error;

        const buffer = Buffer.from(await data.arrayBuffer());
        const tags = await aiService.autoTagDocument(doc.filename, buffer, doc.type);
        
        doc.tags = tags;
        await doc.save();

        res.json({ tags });
    } catch (error) {
        res.status(500).json({ msg: "Auto-tagging failed", error: error.message });
    }
};

// Recycle Bin Logic
export const moveToTrash = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        doc.isTrashed = true;
        doc.trashedAt = new Date();
        await doc.save();

        res.json({ msg: "Moved to Recycle Bin" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to move to trash", error: error.message });
    }
};

export const restoreFromTrash = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        doc.isTrashed = false;
        doc.trashedAt = null;
        await doc.save();

        res.json({ msg: "Document restored" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to restore", error: error.message });
    }
};

export const deletePermanently = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);
        if (!doc) return res.status(404).json({ msg: "Document not found" });

        const { error } = await supabase.storage.from("documents").remove([doc.public_id]);
        if (error) throw error;

        await Document.findByIdAndDelete(id);

        // Log delete
        await Log.create({
            userId: req.userId,
            action: "DELETE_PERMANENT",
            details: `Permanently deleted ${doc.filename}`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });

        res.json({ msg: "Deleted permanently" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete permanently", error: error.message });
    }
};

// Bulk Actions
export const bulkMoveToTrash = async (req, res) => {
    try {
        const { ids } = req.body;
        await Document.updateMany({ _id: { $in: ids }, uploadedBy: req.userId }, { isTrashed: true, trashedAt: new Date() });
        res.json({ msg: `${ids.length} items moved to trash` });
    } catch (error) {
        res.status(500).json({ msg: "Bulk move failed", error: error.message });
    }
};

export const getStorageStats = async (req, res) => {
    try {
        const stats = await Document.aggregate([
            { $match: { uploadedBy: new mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: null, totalSize: { $sum: "$size" }, count: { $sum: 1 } } }
        ]);
        
        const used = stats.length > 0 ? stats[0].totalSize : 0;
        const limit = 5 * 1024 * 1024 * 1024; // 5GB limit
        
        res.json({ used, limit, count: stats.length > 0 ? stats[0].count : 0 });
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch stats", error: error.message });
    }
};

// Digital Signature
export const signDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { signatureData, x = 400, y = 100, scale = 0.5 } = req.body; // signatureData is base64
        
        const doc = await Document.findById(id);
        if (!doc || doc.type !== "application/pdf") {
            return res.status(400).json({ msg: "Only PDFs can be signed" });
        }

        const { data: pdfData, error } = await supabase.storage.from("documents").download(doc.public_id);
        if (error) throw error;

        const buffer = Buffer.from(await pdfData.arrayBuffer());
        const pdfDoc = await PDFDocument.load(buffer);
        
        const sigImage = await pdfDoc.embedPng(signatureData); // Expecting PNG base64
        const pages = pdfDoc.getPages();
        const lastPage = pages[pages.length - 1];
        
        const dims = sigImage.scale(scale);
        lastPage.drawImage(sigImage, {
            x,
            y,
            width: dims.width,
            height: dims.height,
        });

        const signedPdfBytes = await pdfDoc.save();
        
        // Log signing
        await Log.create({
            userId: req.userId,
            documentId: id,
            action: "SIGN",
            details: `Digitally signed PDF: ${doc.filename}`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=signed-${doc.filename}`);
        res.send(Buffer.from(signedPdfBytes));
    } catch (error) {
        res.status(500).json({ msg: "Signing failed", error: error.message });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await Log.find({ userId: req.userId })
            .populate("documentId", "filename")
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch logs", error: error.message });
    }
};
