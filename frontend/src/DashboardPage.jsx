import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "./config";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import FilesSection from "./components/FilesSection";
import VersionModal from "./components/VersionModal";
import ResizeModal from "./components/ResizeModal";
import ShareModal from "./components/ShareModal";
import DownloadImageAsPDF from "./components/DownloadImageasPDF";
import EmailModal from "./components/EmailModal";
import CompressModal from "./components/CompressModal";
import CropModal from "./components/CropModal";
import PullToRefresh from "./components/PullToRefresh";
import VaultPinModal from "./components/VaultPinModal";
import SplitPdfModal from "./components/SplitPdfModal";
import WatermarkModal from "./components/WatermarkModal";
import FileExpiryModal from "./components/FileExpiryModal";
import ImageConvertModal from "./components/ImageConvertModal";

import AuditLogModal from "./components/AuditLogModal";
import SignModal from "./components/SignModal";
import { useToast } from "./context/ToastContext";

export default function DashboardPage() {
  const { addToast } = useToast();
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [versionFile, setVersionFile] = useState(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [user, setUser] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showVersions, setShowVersions] = useState(false);
  const [showResize, setShowResize] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPdfDownload, setShowPdfDownload] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCompressModal, setShowCompressModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [sharingFile, setSharingFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [emailFile, setEmailFile] = useState(null);
  const [compressFile, setCompressFile] = useState(null);
  const [cropFile, setCropFile] = useState(null);
  const [splitFile, setSplitFile] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const [watermarkFile, setWatermarkFile] = useState(null);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);

  const [expiryFile, setExpiryFile] = useState(null);
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  const [convertFile, setConvertFile] = useState(null);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [storageStats, setStorageStats] = useState({ used: 0, limit: 5 * 1024 * 1024 * 1024, count: 0 });
  
  // Vault Logic
  const [showPinModal, setShowPinModal] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [pinMode, setPinMode] = useState("verify");

  const [showLogModal, setShowLogModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signingFile, setSigningFile] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFiles();
    fetchUserProfile();
    fetchStorageStats();
  }, [navigate, token]);

  const fetchStorageStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/docs/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStorageStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchFiles = async (filter = activeFilter) => {
    try {
      let url = `${API_URL}/api/docs`;
      if (filter === 'vault') {
          url += "?vault=true";
      } else if (filter === 'trash') {
          url += "?trash=true";
      }
      
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedFiles = res.data.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setFiles(sortedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFiles(activeFilter);
    fetchUserProfile();
    checkVaultStatus();
  }, [navigate, token, activeFilter]);

  const checkVaultStatus = async () => {
      try {
          const res = await axios.get(`${API_URL}/api/auth/vault/status`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setHasPin(res.data.hasPin);
      } catch (error) {
          console.error("Vault status error", error);
      }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API_URL}/api/docs/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      document.getElementById("file-input").value = "";
      fetchFiles();
      fetchStorageStats();
    } catch (error) {
      console.error("Upload error:", error);
      addToast("Upload failed. Please try again.", 'error');
    }
    setUploading(false);
  };
  
  const handleToggleSelect = (id) => {
      setSelectedFileIds(prev => {
          if (prev.includes(id)) return prev.filter(i => i !== id);
          return [...prev, id];
      });
  };

  const handleNewVersionUpload = async () => {
    if (!versionFile || !selectedFile) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", versionFile);

      await axios.post(`${API_URL}/api/docs/${selectedFile._id}/version`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setVersionFile(null);
      setShowVersions(false);
      document.getElementById("version-file-input").value = "";
      fetchFiles();
    } catch (error) {
      console.error("Version upload error:", error);
      alert("Version upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleShareFile = async (fileId, expiresIn) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/docs/share/${fileId}`,
        { expiresIn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response;
    } catch (error) {
      console.error("Error sharing file:", error);
      throw error;
    }
  };

  const handleRevokeShare = async (fileId) => {
    try {
      await axios.post(
        `${API_URL}/api/docs/share/revoke/${fileId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFiles();
    } catch (error) {
      console.error("Error revoking share:", error);
      throw error;
    }
  };

  const handleSendEmail = async (fileId, emailData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/docs/${fileId}/send-email`,
        emailData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToast("Email sent successfully!", 'success');
      return response;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  const handleCompressPDF = async (fileId, level) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/docs/compress/${fileId}?level=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compressed-${level}-${compressFile.filename}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setShowCompressModal(false);
    } catch (error) {
      console.error("PDF compression error:", error);
      addToast("Failed to compress PDF.", 'error');
    }
  };

  const handleDelete = async (id) => {
    // If not in trash view, move to trash. If in trash view, ignore (Delete permanent handles it).
    if (activeFilter === 'trash') return;
    
    if (!window.confirm("Move this document to Recycle Bin?")) return;
    setDeletingId(id);
    try {
      await axios.patch(`${API_URL}/api/docs/${id}/trash`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
      addToast("Moved to Recycle Bin", "success");
    } catch (error) {
      console.error("Trash error:", error);
      addToast("Failed to move to trash.", 'error');
    }
    setDeletingId(null);
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/docs/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles(activeFilter);
      addToast("Document restored", "success");
    } catch (error) {
      addToast("Failed to restore", "error");
    }
  };

  const handleDeletePermanent = async (id) => {
    if (!window.confirm("This will PERMANENTLY delete the file. Continue?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/api/docs/${id}/permanent`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles(activeFilter);
      fetchStorageStats();
      addToast("Deleted permanently", "success");
    } catch (error) {
      addToast("Delete failed", "error");
    }
    setDeletingId(null);
  };

  const handleBulkTrash = async (ids) => {
      if (!window.confirm(`Move ${ids.length} items to Recycle Bin?`)) return;
      try {
          await axios.post(`${API_URL}/api/docs/bulk/trash`, { ids }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setSelectedFileIds([]);
          fetchFiles(activeFilter);
          addToast("Moved items to Recycle Bin", "success");
      } catch (error) {
          addToast("Bulk move failed", "error");
      }
  };

  const handleSummarize = async (id) => {
      try {
          const res = await axios.get(`${API_URL}/api/docs/ai/summarize/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          return res.data.summary;
      } catch (error) {
          addToast("AI Summarize failed", "error");
          throw error;
      }
  };

  const handleAIByChat = async (id, question) => {
      try {
          const res = await axios.post(`${API_URL}/api/docs/ai/chat/${id}`, { question }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          return res.data.answer;
      } catch (error) {
          addToast("AI Chat failed", "error");
          throw error;
      }
  };

  const handleToggleFavorite = async (id) => {
    setTogglingId(id);
    try {
      await axios.patch(`${API_URL}/api/docs/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (error) {
      console.error("Favorite toggle error:", error);
      addToast("Failed to update favorite status.", 'error');
    }
    setTogglingId(null);
  };

  const handleTogglePin = async (id) => {
    setTogglingId(id);
    try {
      await axios.patch(`${API_URL}/api/docs/${id}/pin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (error) {
      console.error("Pin toggle error:", error);
      addToast("Failed to update pin status.", 'error');
    }
    setTogglingId(null);
  };

  const handleRestoreVersion = async (fileId, versionNumber) => {
    try {
      await axios.post(`${API_URL}/api/docs/${fileId}/restore/${versionNumber}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowVersions(false);
      fetchFiles();
    } catch (error) {
      console.error("Restore version error:", error);
      addToast("Failed to restore version.", 'error');
    }
  };

  const handleRename = async (id, newName) => {
    try {
      await axios.put(`${API_URL}/api/docs/rename/${id}`,  
        { newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFiles();
      return true;
    } catch (error) {
      console.error("Rename error:", error);
      addToast("Rename failed. Please try again.", 'error');
      return false;
    }
  };

  const handleResizeImage = async (fileId, width, height, quality) => {
    try {
      const params = new URLSearchParams();
      if (width) params.append('width', width);
      if (height) params.append('height', height);
      if (quality) params.append('quality', quality);
      
      const response = await axios.get(
        `${API_URL}/api/docs/download/${fileId}/resize?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resized-${selectedFile.filename}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setShowResize(false);
    } catch (error) {
      console.error("Resize image error:", error);
      addToast("Failed to resize image.", 'error');
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchFiles();
      return;
    }
    
    try {
      const res = await axios.get(`${API_URL}/api/docs/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: 'file-pdf',
      doc: 'file-word',
      docx: 'file-word',
      xls: 'file-excel',
      xlsx: 'file-excel',
      ppt: 'file-powerpoint',
      pptx: 'file-powerpoint',
      jpg: 'file-image',
      jpeg: 'file-image',
      png: 'file-image',
      gif: 'file-image',
      txt: 'file-alt',
      zip: 'file-archive',
      rar: 'file-archive',
      mp3: 'file-audio',
      mp4: 'file-video',
    };
    return iconMap[extension] || 'file';
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  const isPDFFile = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    return extension === 'pdf';
  };

  const getFileThumbnail = (file) => {
    if (isImageFile(file.filename)) {
      return (
        <div className="file-thumbnail">
          <img src={file.url} alt={file.filename} />
          <div className="thumbnail-overlay"></div>
        </div>
      );
    }
    
    return (
      <div className="file-icon-large">
        <i className={`fas fa-${getFileIcon(file.filename)}`}></i>
      </div>
    );
  };

  const onViewVersions = (file) => {
    setSelectedFile(file);
    setShowVersions(true);
  };

  const onResizeImage = (file) => {
    setSelectedFile(file);
    setShowResize(true);
  };

  const onDownloadAsPdf = (file) => {
    setPdfFile(file);
    setShowPdfDownload(true);
  };

  const onSendEmail = (file) => {
    setEmailFile(file);
    setShowEmailModal(true);
  };

  const onCompressPDF = (file) => {
    setCompressFile(file);
    setShowCompressModal(true);
  };

  const filteredFiles = files.filter(f => {
    if (activeFilter === "favorites") return f.isFavorite && !f.isTrashed;
    if (activeFilter === "pinned") return f.isPinned && !f.isTrashed;
    if (activeFilter === "vault") return f.isVault && !f.isTrashed;
    if (activeFilter === "trash") return f.isTrashed;
    return !f.isTrashed;
  });

  const handleToggleVault = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/docs/${id}/vault`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles(activeFilter);
    } catch (error) {
      console.error("Vault toggle error:", error);
      addToast("Failed to update vault status.", 'error');
    }
  };

  const handleSetExpiry = (file) => {
    // Check if we passed ID or full object
    const fileObj = typeof file === 'string' ? files.find(f => f._id === file) : file;
    setExpiryFile(fileObj);
    setShowExpiryModal(true);
  };

  const handleConfirmExpiry = async (id, hours) => {
      try {
          await axios.patch(`${API_URL}/api/docs/${id}/expiry`, { hours: parseInt(hours) }, {
             headers: { Authorization: `Bearer ${token}` }
          });
          fetchFiles(activeFilter);
          addToast("Expiry updated", 'success');
      } catch (error) {
          addToast("Failed to set expiry", 'error');
      }
  };

  const handleWatermark = (file) => {
      const fileObj = typeof file === 'string' ? files.find(f => f._id === file) : file;
      setWatermarkFile(fileObj);
      setShowWatermarkModal(true);
  };

  const handleConfirmWatermark = async (id, text) => {
      try {
          const response = await axios.post(`${API_URL}/api/docs/watermark/${id}`, { text }, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob'
          });
          // Auto download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `watermarked-doc`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          addToast("Watermark applied!", "success");
      } catch (error) {
          addToast("Failed to watermark", 'error');
      }
  };

  const handleConvertImage = (file) => {
      const fileObj = typeof file === 'string' ? files.find(f => f._id === file) : file;
      setConvertFile(fileObj);
      setShowConvertModal(true);
  };

  const handleConfirmConvert = async (id, format) => {
      try {
          const response = await axios.post(`${API_URL}/api/docs/convert/${id}`, { format }, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob'
          });
           const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `converted.${format}`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          addToast("Image converted successfully!", "success");
      } catch (error) {
          addToast("Failed to convert image", 'error');
      }
  };

  // Placeholders for complex UI modals (Split/Crop/Merge)
  const handleSplitPDF = (file) => {
    setSplitFile(file);
    setShowSplitModal(true);
  };
  
  const handleConfirmSplit = async (fileId, range) => {
      try {
          const response = await axios.post(`${API_URL}/api/docs/split/${fileId}`, 
            { ranges: range }, 
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob'
            }
          );
          
          // Auto download split file (zip or single pdf based on backend)
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `split-${splitFile.filename}.zip`); // Assuming backend zips multiple parts
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          addToast("PDF split successfully!", "success");
      } catch (error) {
          console.error("Split error:", error);
          addToast("Failed to split PDF. Check page ranges.", "error");
      }
  };

  const handleMergePDFs = async (fileIds) => {
      try {
          const response = await axios.post(`${API_URL}/api/docs/merge`, { docIds: fileIds }, {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob'
          });
          
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `merged-document.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          setSelectedFileIds([]); // Clear selection
      } catch (error) {
          console.error("Merge error:", error);
          addToast("Failed to merge PDFs. Ensure they are valid PDF files.", 'error');
      }
  };

  const handleExportAll = async () => {
    try {
      addToast("Preparing your archive... this may take a moment", "info");
      const response = await axios.get(`${API_URL}/api/docs/download-all`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
        timeout: 60000 // 1 minute timeout for large exports
      });
      
      console.log("Export Response Size:", response.data.size);

      if (!response.data || response.data.size === 0) {
          throw new Error("Received an empty file from the server.");
      }

      const url = window.URL.createObjectURL(response.data);
      
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', `CloudDoc_Export_${new Date().getTime()}.zip`);
      
      document.body.appendChild(link);
      
      // Force a manual click
      try {
          link.click();
      } catch (err) {
          console.error("Direct click failed, trying manual event", err);
          const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          link.dispatchEvent(clickEvent);
      }
      
      // Cleanup
      setTimeout(() => {
          window.URL.revokeObjectURL(url);
          if (document.body.contains(link)) {
              document.body.removeChild(link);
          }
      }, 1000);
      
      addToast("Export complete! Your download should start shortly.", "success");
    } catch (error) {
      console.error("Export error:", error);
      const errorMsg = error.response?.data?.msg || error.message || "Failed to export files.";
      addToast(errorMsg, "error");
    }
  };

  const handleCropImage = (fileId) => {
      // Find full file object to get URL
      const fileToCrop = files.find(f => f._id === fileId);
      if (fileToCrop) {
          setCropFile(fileToCrop);
          setShowCropModal(true);
      }
  };

  const handleConfirmCrop = async (id, width, height, left, top) => {
      try {
          const response = await axios.post(`${API_URL}/api/docs/crop/${id}`, 
            { width: parseInt(width), height: parseInt(height), left: parseInt(left), top: parseInt(top) }, 
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: 'blob'
            }
          );
           
          // Auto download cropped image
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `cropped-${cropFile.filename}`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          setShowCropModal(false);
          setCropFile(null);
      } catch (error) {
          console.error("Crop error:", error);
          addToast("Failed to crop image. Ensure crop is within bounds.", 'error');
      }
  };

  const handleSign = async (fileId, signatureData) => {
    try {
        const response = await axios.post(`${API_URL}/api/docs/sign/${fileId}`, 
            { signatureData },
            { 
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            }
        );
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `signed-${signingFile.filename}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        addToast("Document signed successfully!", "success");
    } catch (error) {
        console.error("Signing error:", error);
        addToast("Failed to sign document.", "error");
    }
  };

  return (
    <div className="dashboard-container">
      {/* 3D Background Elements matching MainPage */}
      <div className="bg-3d-layer">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
      </div>
      <div className="bg-gradient-mesh"></div>

      <Header user={user} handleLogout={handleLogout} onUpdateUser={fetchUserProfile} />
      
      <div className="dashboard-content">
        <PullToRefresh onRefresh={() => fetchFiles(activeFilter)}>
          <div className="dashboard-main-grid">
            <div className="content-area">
              <FilesSection
                files={filteredFiles}
                search={search}
                setSearch={setSearch}
                activeFilter={activeFilter}
                setActiveFilter={(filter) => {
                    if (filter === 'vault') {
                        if (activeFilter === 'vault') {
                            setActiveFilter('all');
                        } else {
                            // Check PIN logic
                            setPinMode(hasPin ? "verify" : "set");
                            setShowPinModal(true);
                        }
                    } else {
                        setActiveFilter(filter);
                    }
                }}
                deletingId={deletingId}
                togglingId={togglingId}
                handleDelete={handleDelete}
                handleToggleFavorite={handleToggleFavorite}
                handleTogglePin={handleTogglePin}
                handleSearch={handleSearch}
                formatDate={formatDate}
                formatFileSize={formatFileSize}
                getFileThumbnail={getFileThumbnail}
                handleRename={handleRename}
                onViewVersions={onViewVersions}
                onResizeImage={onResizeImage}
                onShareFile={(file) => {
                    setSharingFile(file);
                    setShowShare(true);
                }}
                onDownloadAsPdf={onDownloadAsPdf}
                onSendEmail={onSendEmail}
                onCompressPDF={onCompressPDF}
                
                // New Features
                onToggleVault={handleToggleVault}
                onSetExpiry={handleSetExpiry}
                onWatermark={handleWatermark}
                onConvertImage={handleConvertImage}
                onSplitPDF={handleSplitPDF}
                onCropImage={handleCropImage}
                selectedFileIds={selectedFileIds}
                onToggleSelect={handleToggleSelect}
                onMergePDFs={handleMergePDFs}
                onExportAll={handleExportAll}
                
                // AI & Trash
                viewMode={viewMode}
                setViewMode={setViewMode}
                onRestore={handleRestore}
                onDeletePermanent={handleDeletePermanent}
                onBulkTrash={handleBulkTrash}
                onSummarize={handleSummarize}
                onChat={handleAIByChat}
                onSign={(file) => {
                    setSigningFile(file);
                    setShowSignModal(true);
                }}
              />
            </div>

            <div className="sidebar-area">
              <div className="sidebar-card storage-card">
                  <div className="card-header">
                      <h4><i className="fas fa-database"></i> Storage</h4>
                      <button className="btn-logs" onClick={() => setShowLogModal(true)} title="View Activity Logs">
                        <i className="fas fa-history"></i> Logs
                      </button>
                      <span className="storage-percent">{((storageStats.used / storageStats.limit) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="quota-bar">
                      <div className="quota-usage" style={{ width: `${Math.min(100, (storageStats.used / storageStats.limit) * 100)}%` }}></div>
                  </div>
                  <div className="quota-labels">
                      <span>{formatFileSize(storageStats.used)} used</span>
                      <span>{formatFileSize(storageStats.limit)}</span>
                  </div>
              </div>

              <UploadSection 
                file={file} 
                setFile={setFile} 
                uploading={uploading} 
                handleUpload={handleUpload} 
              />
              
              {/* Optional: Add storage info or tips here later */}
              <div className="sidebar-card info-card">
                  <h4>Quick Tips</h4>
                  <ul>
                      <li><i className="fas fa-lightbulb"></i> Use the vault for extra security</li>
                      <li><i className="fas fa-compress-arrows-alt"></i> Compress PDFs to save space</li>
                      <li><i className="fas fa-magic"></i> Watermark files before sharing</li>
                  </ul>
              </div>
            </div>
          </div>
        </PullToRefresh>

        {showVersions && selectedFile && (
          <VersionModal
            file={selectedFile}
            versionFile={versionFile}
            setVersionFile={setVersionFile}
            uploading={uploading}
            onUploadNewVersion={handleNewVersionUpload}
            onRestoreVersion={handleRestoreVersion}
            onClose={() => setShowVersions(false)}
            formatDate={formatDate}
          />
        )}
        
        {showShare && sharingFile && (
          <ShareModal
            file={sharingFile}
            onClose={() => {
              setShowShare(false);
              setSharingFile(null);
            }}
            onShare={handleShareFile}
            onRevoke={handleRevokeShare}
          />
        )}

        {showResize && selectedFile && (
          <ResizeModal
            file={selectedFile}
            onResize={handleResizeImage}
            onClose={() => setShowResize(false)}
          />
        )}

        {showPdfDownload && pdfFile && (
          <DownloadImageAsPDF
            file={pdfFile}
            onClose={() => {
              setShowPdfDownload(false);
              setPdfFile(null);
            }}
          />
        )}

        {showEmailModal && emailFile && (
          <EmailModal
            file={emailFile}
            onClose={() => {
              setShowEmailModal(false);
              setEmailFile(null);
            }}
            onSendEmail={handleSendEmail}
          />
        )}

        {showCompressModal && compressFile && (
          <CompressModal
            file={compressFile}
            onClose={() => {
              setShowCompressModal(false);
              setCompressFile(null);
            }}
            onCompress={handleCompressPDF}
          />
        )}
        
        {showCropModal && cropFile && (
            <CropModal
                file={cropFile}
                onClose={() => {
                    setShowCropModal(false);
                    setCropFile(null);
                }}
                onCrop={handleConfirmCrop}
            />
        )}

        {showSignModal && signingFile && (
            <SignModal
                file={signingFile}
                onClose={() => setShowSignModal(false)}
                onSign={handleSign}
            />
        )}

        {showLogModal && (
            <AuditLogModal
                onClose={() => setShowLogModal(false)}
            />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }

        :root {
            --brand-color: #0d9488;
        }
        
        html, body, #root {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        .dashboard-container {
          min-height: 100vh;
          /* background: var(--bg-gradient); Removed to show mesh */
          color: var(--text-primary);
          width: 100%;
          margin: 0;
          padding: 0;
          position: relative;
        }

        .bg-3d-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .bg-gradient-mesh {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: -1;
            /* Simple mesh gradient */
            background: 
                radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.1) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(13, 148, 136, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(162, 28, 175, 0.05) 0px, transparent 50%),
                radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
        }
        .shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            animation: floatShape 20s infinite linear;
        }
        .shape-1 {
            width: 400px; height: 400px;
            background: #ccfbf1;
            top: -100px; left: -100px;
            animation-duration: 25s;
        }
        .shape-2 {
            width: 300px; height: 300px;
            background: #e0f2fe;
            bottom: 10%; right: -50px;
            animation-duration: 30s;
            animation-direction: reverse;
        }
        @keyframes floatShape {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, -50px) rotate(180deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        .dashboard-content {
          max-width: 1400px; /* Wider for 2-column layout */
          margin: 0 auto;
          padding: 30px 20px;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .dashboard-main-grid {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 32px;
            align-items: start;
        }

        .content-area {
            min-width: 0; /* Prevents flex/grid overflow with files-grid */
        }

        .sidebar-area {
            display: flex;
            flex-direction: column;
            gap: 24px;
            position: sticky;
            top: 30px;
        }

        .sidebar-card {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            padding: 24px;
            border-radius: 24px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
        }

        .storage-card .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .btn-logs {
            background: #f1f5f9;
            border: none;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-logs:hover { background: #e2e8f0; color: #1e293b; }

        .info-card h4 {
            margin-bottom: 16px;
            font-size: 1.1rem;
            color: var(--text-primary);
        }

        .info-card ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .info-card li {
            font-size: 0.9rem;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .info-card li i {
            color: var(--accent-color);
            width: 16px;
        }

        .storage-card {
            background: linear-gradient(135deg, var(--card-bg), rgba(var(--accent-rgb, 59, 130, 246), 0.05));
            border: 1px solid var(--border-color);
            padding: 24px;
            border-radius: 24px;
            margin-bottom: 24px;
        }

        .storage-card .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .storage-card h4 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-primary);
        }

        .storage-percent {
            font-weight: 800;
            color: var(--accent-color);
            background: var(--accent-glow);
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.85rem;
        }

        .quota-bar {
            height: 8px;
            background: var(--input-bg);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
            border: 1px solid var(--border-color);
        }

        .quota-usage {
            height: 100%;
            background: linear-gradient(to right, var(--accent-color), #60a5fa);
            box-shadow: 0 0 10px var(--accent-glow);
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .quota-labels {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            color: var(--text-secondary);
            font-weight: 500;
        }

        @media (max-width: 1100px) {
            .dashboard-main-grid {
                grid-template-columns: 1fr;
            }
            .sidebar-area {
                position: static;
                order: -1; /* Keep upload on top in mobile */
            }
        }
        
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 20px 15px;
          }
        }
      `}</style>
        <VaultPinModal
            isOpen={showPinModal}
            mode={pinMode}
            onClose={() => setShowPinModal(false)}
            onSuccess={() => {
                if (pinMode === 'set') {
                    setHasPin(true);
                    addToast("PIN set! You can now access the vault.", 'success');
                } else {
                    setActiveFilter('vault');
                }
            }}
        />

        <SplitPdfModal
            isOpen={showSplitModal}
            file={splitFile}
            onClose={() => setShowSplitModal(false)}
            onSplit={handleConfirmSplit}
        />

        <WatermarkModal
            isOpen={showWatermarkModal}
            file={watermarkFile}
            onClose={() => setShowWatermarkModal(false)}
            onConfirm={handleConfirmWatermark}
        />

        <FileExpiryModal
            isOpen={showExpiryModal}
            file={expiryFile}
            onClose={() => setShowExpiryModal(false)}
            onConfirm={handleConfirmExpiry}
        />

        <ImageConvertModal
            isOpen={showConvertModal}
            file={convertFile}
            onClose={() => setShowConvertModal(false)}
            onConfirm={handleConfirmConvert}
        />
    </div>
  );
}
