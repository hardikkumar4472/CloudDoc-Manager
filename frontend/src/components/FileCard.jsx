import { useState } from "react";
import RenameModal from "./RenameModal";

export default function FileCard({ 
  file, 
  deletingId, 
  togglingId, 
  handleDelete, 
  handleToggleFavorite, 
  handleTogglePin, 
  formatDate, 
  formatFileSize,
  getFileThumbnail,
  onViewVersions,
  onResizeImage,
  onRename,
  onShareFile,
  onDownloadAsPdf,
  onSendEmail,
  onCompressPDF
}) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const isImageFile = (filename) => {
    if (!filename) return false;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    const extension = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };
  
  const isPDFFile = (filename) => {
    if (!filename) return false;
    const extension = filename.split('.').pop().toLowerCase();
    return extension === 'pdf';
  };
  
  const isImage = isImageFile(file.filename);
  const isPDF = isPDFFile(file.filename);
  
  return (
    <>
      <div className="file-card">
        {getFileThumbnail(file)}
        
        <div className="file-details">
          <div className="file-header">
            <h4 className="file-name">{file.filename}</h4>
            <div className="status-badges">
              {file.isPinned && (
                <span className="badge pinned-badge" title="Pinned">
                  <i className="fas fa-thumbtack"></i>
                </span>
              )}
              {file.isFavorite && (
                <span className="badge favorite-badge" title="Favorite">
                  <i className="fas fa-star"></i>
                </span>
              )}
            </div>
          </div>
          
          <div className="file-meta">
            <div className="meta-item">
              <i className="fas fa-calendar"></i>
              <span>{formatDate(file.updatedAt)}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-weight-hanging"></i>
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>
          
          <div className="file-actions">
            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('share')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                onClick={() => onShareFile(file)}
                className="action-btn share-btn"
              >
                <i className="fas fa-share-alt"></i>
              </button>
              {activeTooltip === 'share' && <span className="tooltip">Share file</span>}
            </div>
            
            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('email')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                onClick={() => onSendEmail(file)}
                className="action-btn email-btn"
              >
                <i className="fas fa-envelope"></i>
              </button>
              {activeTooltip === 'email' && <span className="tooltip">Send via email</span>}
            </div>

            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('favorite')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                onClick={() => handleToggleFavorite(file._id)}
                disabled={togglingId === file._id}
                className={`action-btn favorite-btn ${file.isFavorite ? "active" : ""}`}
              >
                {togglingId === file._id ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className={`fas fa-star ${file.isFavorite ? "solid" : ""}`}></i>
                )}
              </button>
              {activeTooltip === 'favorite' && (
                <span className="tooltip">
                  {file.isFavorite ? "Remove from favorites" : "Add to favorites"}
                </span>
              )}
            </div>
            
            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('pin')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                onClick={() => handleTogglePin(file._id)}
                disabled={togglingId === file._id}
                className={`action-btn pin-btn ${file.isPinned ? "active" : ""}`}
              >
                {togglingId === file._id ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-thumbtack"></i>
                )}
              </button>
              {activeTooltip === 'pin' && (
                <span className="tooltip">
                  {file.isPinned ? "Unpin file" : "Pin file"}
                </span>
              )}
            </div>

            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('rename')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                onClick={() => setIsRenameModalOpen(true)}
                className="action-btn rename-btn"
              >
                <i className="fas fa-edit"></i>
              </button>
              {activeTooltip === 'rename' && <span className="tooltip">Rename file</span>}
            </div>

            {file.versions && file.versions.length > 0 && (
              <div 
                className="tooltip-container"
                onMouseEnter={() => setActiveTooltip('versions')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  onClick={() => onViewVersions(file)}
                  className="action-btn versions-btn"
                >
                  <i className="fas fa-history"></i>
                </button>
                {activeTooltip === 'versions' && <span className="tooltip">View versions</span>}
              </div>
            )}

            {isImage && (
              <div 
                className="tooltip-container"
                onMouseEnter={() => setActiveTooltip('resize')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  onClick={() => onResizeImage(file)}
                  className="action-btn resize-btn"
                >
                  <i className="fas fa-expand-arrows-alt"></i>
                </button>
                {activeTooltip === 'resize' && <span className="tooltip">Resize image</span>}
              </div>
            )}

            {isImage && (
              <div 
                className="tooltip-container"
                onMouseEnter={() => setActiveTooltip('pdf')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  onClick={() => onDownloadAsPdf(file)}
                  className="action-btn pdf-btn"
                >
                  <i className="fas fa-file-pdf"></i>
                </button>
                {activeTooltip === 'pdf' && <span className="tooltip">Download as PDF</span>}
              </div>
            )}

            {isPDF && (
              <div 
                className="tooltip-container"
                onMouseEnter={() => setActiveTooltip('compress')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                <button
                  onClick={() => onCompressPDF(file)}
                  className="action-btn compress-btn"
                >
                  <i className="fas fa-compress-alt"></i>
                </button>
                {activeTooltip === 'compress' && <span className="tooltip">Compress PDF</span>}
              </div>
            )}
            
            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('view')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <a 
                href={file.url} 
                target="_blank" 
                rel="noreferrer" 
                className="action-btn view-btn"
              >
                <i className="fas fa-eye"></i>
              </a>
              {activeTooltip === 'view' && <span className="tooltip">View file</span>}
            </div>
            
            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('download')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <a 
                href={`https://clouddoc-manager.onrender.com/api/docs/download/${file._id}`}
                download={file.filename}
                className="action-btn download-btn"
              >
                <i className="fas fa-download"></i>
              </a>
              {activeTooltip === 'download' && <span className="tooltip">Download file</span>}
            </div>
            
            <div 
              className="tooltip-container"
              onMouseEnter={() => setActiveTooltip('delete')}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button 
                onClick={() => handleDelete(file._id)} 
                disabled={deletingId === file._id}
                className="action-btn delete-btn"
              >
                {deletingId === file._id ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-trash"></i>
                )}
              </button>
              {activeTooltip === 'delete' && <span className="tooltip">Delete file</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Rename Modal */}
      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        currentName={file.filename}
        onRename={onRename}
        fileId={file._id}
      />

      <style>{`
        .file-card {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.25);
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          backdrop-filter: blur(80px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        }
        
        .file-card:hover {
          transform: translateY(-5px);
          background: rgba(0, 0, 0, 0.12);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.86);
        }
        
        .file-thumbnail {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
        
        .file-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .file-card:hover .file-thumbnail img {
          transform: scale(1.05);
        }
        
        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
          opacity: 0.7;
        }
        
        .file-icon-large {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          font-size: 48px;
        }
        
        .file-details {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .file-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        
        .file-name {
          font-weight: 600;
          margin: 0;
          font-size: 16px;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          flex: 1;
        }
        
        .status-badges {
          display: flex;
          gap: 5px;
        }
        
        .badge {
          width: 24px;
          height: 24px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }
          .badge:hover{
            transform: translateY(-5px);
            transition: all 0.3s ease;
          }
        
        .pinned-badge {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .favorite-badge {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        
        .file-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .meta-item i {
          width: 16px;
          color: #4fc3f7;
        }
        
        .file-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          flex-wrap: wrap;
          position: relative;
        }
        
        .tooltip-container {
          position: relative;
          display: flex;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 40px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
        }
        .action-btn:hover{
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
        
        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 100;
          margin-bottom: 8px;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
        
        .share-btn {
          background: rgba(156, 39, 176, 0.2);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.3);
          border-radius: 40px;
        }

        .share-btn:hover {
          background: rgba(156, 39, 176, 0.3);
        }
        
        .email-btn {
          background: rgba(33, 150, 243, 0.2);
          color: #2196f3;
          border: 1px solid rgba(33, 150, 243, 0.3);
        }

        .email-btn:hover {
          background: rgba(33, 150, 243, 0.3);
        }
        
        .favorite-btn {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .favorite-btn.active, .favorite-btn:hover {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border-color: rgba(255, 193, 7, 0.3);
        }
        
        .pin-btn {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .pin-btn.active, .pin-btn:hover {
          background: rgba(79, 195, 247, 0.2);
          color: #4fc3f7;
          border-color: rgba(79, 195, 247, 0.3);
        }
        
        .rename-btn {
          background: rgba(255, 193, 07, 0.2);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .rename-btn:hover {
          background: rgba(255, 193, 7, 0.3);
          transform: translateY(-2px);
        }
        
        .versions-btn {
          background: rgba(106, 176, 230, 0.2);
          color: #6ab0e6;
          border: 1px solid rgba(106, 176, 230, 0.3);
        }
        
        .versions-btn:hover {
          background: rgba(106, 176, 230, 0.3);
        }
        
        .resize-btn {
          background: rgba(156, 39, 176, 0.2);
          color: #9c27b0;
          border: 1px solid rgba(156, 39, 176, 0.3);
        }
        
        .resize-btn:hover {
          background: rgba(156, 39, 176, 0.3);
        }
        
        .pdf-btn {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }
        
        .pdf-btn:hover {
          background: rgba(231, 76, 60, 0.3);
        }
        
        .view-btn {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .view-btn:hover {
          background: rgba(76, 175, 80, 0.3);
        }
        
        .download-btn {
          background: rgba(76, 217, 100, 0.2);
          color: #4cd964;
          border: 1px solid rgba(76, 217, 100, 0.3);
        }
        
        .download-btn:hover {
          background: rgba(76, 217, 100, 0.3);
        }
        
        .delete-btn {
          background: rgba(255, 59, 48, 0.2);
          color: #ff3b30;
          border: 1px solid rgba(255, 59, 48, 0.3);
        }
        
        .delete-btn:hover:not(:disabled) {
          background: rgba(255, 59, 48, 0.3);
        }
        
        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
          .file-thumbnail, .file-icon-large {
            height: 160px;
          }
          
          .file-actions {
            gap: 5px;
          }
          
          .action-btn {
            width: 35px;
            height: 35px;
            font-size: 12px;
          }
          
          .tooltip {
            font-size: 10px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </>
  );
}
