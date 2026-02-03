import express from "express";
import { 
  uploadFile, 
  getFiles, 
  deleteFile, 
  viewFile, 
  downloadFile,
  toggleFavorite,
  togglePin,
  resizeImageDownload,
  searchFiles,
  renameDocument,
  generateShareLink,
  accessSharedFile,
  revokeShareLink,
  downloadImageAsPDF,
  sendDocumentAsAttachment,
  compressPDF,
  mergePDFs,
  splitPDF,
  addWatermark,
  convertImageFormat,
  cropImage,
  toggleVault,
  setFileExpiry,
  downloadAllFiles,
  // New Imports
  summarizeDocument,
  chatWithDocument,
  autoTagDocument,
  moveToTrash,
  restoreFromTrash,
  deletePermanently,
  bulkMoveToTrash,
  getStorageStats,
  signDocument,
  getAuditLogs
} from "../controllers/doc.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getFiles);
router.get("/download-all", authMiddleware, downloadAllFiles);
router.get("/stats", authMiddleware, getStorageStats);
router.get("/logs", authMiddleware, getAuditLogs);
router.get("/view/:id", authMiddleware, viewFile);
router.get("/download/:id",  downloadFile);
router.delete("/:id", authMiddleware, deleteFile);
router.patch("/:id/favorite", authMiddleware, toggleFavorite);
router.patch("/:id/pin", authMiddleware, togglePin);
router.get("/download/:id/resize", authMiddleware, resizeImageDownload);
router.put("/rename/:id", authMiddleware, renameDocument);
router.get("/search", authMiddleware, searchFiles);
router.post("/share/:id", authMiddleware, generateShareLink);
router.get("/share/access/:token", accessSharedFile);
router.post("/share/revoke/:id", authMiddleware, revokeShareLink);
router.get("/download/pdf/:id", authMiddleware, downloadImageAsPDF);
router.post("/:id/send-email", authMiddleware, sendDocumentAsAttachment);
router.get("/compress/:id", authMiddleware, compressPDF);

// AI & Processing
router.get("/ai/summarize/:id", authMiddleware, summarizeDocument);
router.post("/ai/chat/:id", authMiddleware, chatWithDocument);
router.post("/ai/autotag/:id", authMiddleware, autoTagDocument);

// New Feature Routes
router.post("/merge", authMiddleware, mergePDFs);
router.post("/split/:id", authMiddleware, splitPDF);
router.post("/watermark/:id", authMiddleware, addWatermark);
router.post("/convert/:id", authMiddleware, convertImageFormat);
router.post("/crop/:id", authMiddleware, cropImage);
router.patch("/:id/vault", authMiddleware, toggleVault);
router.patch("/:id/expiry", authMiddleware, setFileExpiry);

// Recycle Bin
router.patch("/:id/trash", authMiddleware, moveToTrash);
router.patch("/:id/restore", authMiddleware, restoreFromTrash);
router.delete("/:id/permanent", authMiddleware, deletePermanently);
router.post("/bulk/trash", authMiddleware, bulkMoveToTrash);

// Digital Signature
router.post("/sign/:id", authMiddleware, signDocument);

export default router;