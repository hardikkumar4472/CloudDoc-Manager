import { createClient } from "@supabase/supabase-js";
import Document from "../models/Document.js";
import sharp from "sharp"; 
import crypto from "crypto";
import jsPDF from "jspdf";
import { sendMail } from "../services/sendEmail.js";
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

    await doc.save();

    res.status(201).json({ msg: "File uploaded successfully", document: doc });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ msg: "Error uploading file", error: error.message });
  }
};
export const getFiles = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.userId })
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
    const pdfDoc = await PDFDocument.load(buffer);
    let quality;
    switch (level) {
      case "low":
        quality = 0.3;
        break;
      case "medium":
        quality = 0.6;
        break;
      case "high":
      default:
        quality = 0.85;
        break;
    }
    const compressedDoc = await PDFDocument.create();
    const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => {
      compressedDoc.addPage(page);
    });
    compressedDoc.setTitle(`Compressed (${level}) - ${doc.filename}`);
    compressedDoc.setAuthor("PDF Compressor");
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
      msg: "Error compressing PDF", 
      error: err.message 
    });
  }
};