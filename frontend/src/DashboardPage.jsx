import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import FilesSection from "./components/FilesSection";
import VersionModal from "./components/VersionModal";
import ResizeModal from "./components/ResizeModal";
import ShareModal from "./components/ShareModal";
import DownloadImageAsPDF from "./components/DownloadImageasPDF";
import EmailModal from "./components/EmailModal";
import CompressModal from "./components/CompressModal";

export default function DashboardPage() {
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
  const [sharingFile, setSharingFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [emailFile, setEmailFile] = useState(null);
  const [compressFile, setCompressFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchFiles();
    fetchUserProfile();
  }, [navigate, token]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get("/api/docs", {
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

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/api/auth/profile", {
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

      await axios.post("/api/docs/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      document.getElementById("file-input").value = "";
      fetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleNewVersionUpload = async () => {
    if (!versionFile || !selectedFile) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", versionFile);

      await axios.post(`/api/docs/${selectedFile._id}/version`, formData, {
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
        `http://localhost:5000/api/docs/share/${fileId}`,
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
        `/api/docs/share/revoke/${fileId}`,
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
        `/api/docs/${fileId}/send-email`,
        emailData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Email sent successfully!");
      return response;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };

  const handleCompressPDF = async (fileId, level) => {
    try {
      const response = await axios.get(
        `/api/docs/compress/${fileId}?level=${level}`,
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
      alert("Failed to compress PDF.");
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`/api/docs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed. Please try again.");
    }
    setDeletingId(null);
  };

  const handleToggleFavorite = async (id) => {
    setTogglingId(id);
    try {
      await axios.patch(`/api/docs/${id}/favorite`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (error) {
      console.error("Favorite toggle error:", error);
      alert("Failed to update favorite status.");
    }
    setTogglingId(null);
  };

  const handleTogglePin = async (id) => {
    setTogglingId(id);
    try {
      await axios.patch(`/api/docs/${id}/pin`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFiles();
    } catch (error) {
      console.error("Pin toggle error:", error);
      alert("Failed to update pin status.");
    }
    setTogglingId(null);
  };

  const handleRestoreVersion = async (fileId, versionNumber) => {
    try {
      await axios.post(`/api/docs/${fileId}/restore/${versionNumber}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowVersions(false);
      fetchFiles();
    } catch (error) {
      console.error("Restore version error:", error);
      alert("Failed to restore version.");
    }
  };

  const handleRename = async (id, newName) => {
    try {
      await axios.put(`/api/docs/rename/${id}`, 
        { newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFiles();
      return true;
    } catch (error) {
      console.error("Rename error:", error);
      alert("Rename failed. Please try again.");
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
        `/api/docs/download/${fileId}/resize?${params.toString()}`,
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
      alert("Failed to resize image.");
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchFiles();
      return;
    }
    
    try {
      const res = await axios.get(`/api/docs/search?query=${encodeURIComponent(query)}`, {
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
    if (activeFilter === "favorites") return f.isFavorite;
    if (activeFilter === "pinned") return f.isPinned;
    return true;
  });

  return (
    <div className="dashboard-container">
      <Header user={user} handleLogout={handleLogout} />
      
      <div className="dashboard-content">
        <UploadSection 
          file={file} 
          setFile={setFile} 
          uploading={uploading} 
          handleUpload={handleUpload} 
        />
        
        <FilesSection
          files={filteredFiles}
          search={search}
          setSearch={setSearch}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
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
        />

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
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
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
          background: linear-gradient(135deg, #000000ff 0%, #0a0f17ff 100%);
          color: #fff;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 20px;
          width: 100%;
          box-sizing: border-box;
        }
        
        @media (max-width: 768px) {
          .dashboard-content {
            padding: 20px 15px;
          }
        }
      `}</style>
    </div>
  );
}