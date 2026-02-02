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
  setFileExpiry
} from "../controllers/doc.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
const router = express.Router();
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/", authMiddleware, getFiles);
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

// New Feature Routes
router.post("/merge", authMiddleware, mergePDFs);
router.post("/split/:id", authMiddleware, splitPDF);
router.post("/watermark/:id", authMiddleware, addWatermark);
router.post("/convert/:id", authMiddleware, convertImageFormat);
router.post("/crop/:id", authMiddleware, cropImage);
router.patch("/:id/vault", authMiddleware, toggleVault);
router.patch("/:id/expiry", authMiddleware, setFileExpiry);



export default router;