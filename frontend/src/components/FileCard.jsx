import { useState } from "react";
import RenameModal from "./RenameModal";
import { API_URL } from "../config";

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
  onCompressPDF,
  onToggleVault,
  onSetExpiry,
  onWatermark,
  onConvertImage,
  onSplitPDF,
  onCropImage,
  isSelected,
  onToggleSelect,
  viewMode = 'grid',
  isTrashView = false,
  onRestore,
  onDeletePermanent,
  onSummarize,
  onChat,
  onSign
}) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [aiSummary, setAiSummary] = useState(file.summary || null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [activeTab, setActiveTab] = useState('doc'); // 'doc' or 'ai'

  const handleSummarize = async () => {
    if (aiSummary) return;
    setIsSummarizing(true);
    try {
        const response = await onSummarize(file._id);
        setAiSummary(response);
    } catch (err) {
        console.error(err);
    } finally {
        setIsSummarizing(false);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatQuestion) return;
    setIsChatting(true);
    try {
        const response = await onChat(file._id, chatQuestion);
        setChatAnswer(response);
    } catch (err) {
        console.error(err);
    } finally {
        setIsChatting(false);
    }
  };

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
      <div className={`file-card ${viewMode === 'list' ? 'list-card' : ''} ${isSelected ? 'selected' : ''}`}>
        <div className="card-media">
            {getFileThumbnail(file)}
            <div className="selection-overlay" onClick={(e) => { e.stopPropagation(); onToggleSelect(file._id); }}>
                <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
                    {isSelected && <i className="fas fa-check"></i>}
                </div>
            </div>
            {file.tags && file.tags.length > 0 && viewMode === 'grid' && (
                <div className="tag-overlay">
                    {file.tags.map((t, idx) => <span key={idx} className="mini-tag">{t}</span>)}
                </div>
            )}
        </div>
        
        <div className="file-content">
          <div className="file-primary-info">
            <div className="file-header">
                <h4 className="file-name" title={file.filename}>
                    {file.filename}
                    <i className="fas fa-pencil-alt rename-icon" onClick={() => setIsRenameModalOpen(true)} title="Rename"></i>
                </h4>
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
                {file.tags && file.tags.length > 0 && viewMode === 'list' && (
                    <div className="list-tags">
                        {file.tags.map((t, idx) => <span key={idx} className="list-tag">#{t}</span>)}
                    </div>
                )}
            </div>
          </div>

          
          <div className="file-actions">
            {isTrashView ? (
                <div className="trash-actions">
                    <button className="action-pill btn-restore" onClick={() => onRestore(file._id)}>
                        <i className="fas fa-undo"></i> Restore
                    </button>
                    <button className="action-pill btn-delete-perm" onClick={() => onDeletePermanent(file._id)}>
                        <i className="fas fa-trash-alt"></i> Delete Forever
                    </button>
                </div>
            ) : (
                <>
                <div className="action-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'doc' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doc')}
                    >
                        <i className="fas fa-tools"></i> Doc Tools
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ai')}
                    >
                        <i className="fas fa-magic"></i> AI Features
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'doc' && (
                        <div className="doc-tools-grid">
                            {/* Row 1 */}
                            <div className="icon-btn-circle share-v2" onClick={() => onShareFile(file)} title="Share">
                                <i className="fas fa-share-alt"></i>
                            </div>
                            <div className="icon-btn-circle email-v2" onClick={() => onSendEmail(file)} title="Email">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <div className="icon-btn-circle favorite-v2" onClick={() => handleToggleFavorite(file._id)}>
                                <i className={`fas fa-star ${file.isFavorite ? 'filled' : ''}`}></i>
                            </div>
                            <div className="icon-btn-circle pin-v2" onClick={() => handleTogglePin(file._id)}>
                                <i className="fas fa-thumbtack"></i>
                            </div>
                            <div className="icon-btn-circle rename-v2" onClick={() => setIsRenameModalOpen(true)}>
                                <i className="fas fa-edit"></i>
                            </div>

                            {/* Row 2 */}
                            <div className="icon-btn-circle resize-v2" onClick={() => isImage ? onResizeImage(file) : onCompressPDF(file._id)}>
                                <i className="fas fa-expand-arrows-alt"></i>
                            </div>
                            <div className="icon-btn-circle view-v2" onClick={() => window.open(file.url, '_blank')}>
                                <i className="fas fa-eye"></i>
                            </div>
                            <a href={`${API_URL}/api/docs/download/${file._id}`} download={file.filename} className="icon-btn-circle download-v2">
                                <i className="fas fa-download"></i>
                            </a>
                            <div className="icon-btn-circle delete-v2" onClick={() => handleDelete(file._id)}>
                                <i className="fas fa-trash"></i>
                            </div>
                            <div className="icon-btn-circle vault-v2" onClick={() => onToggleVault(file._id)}>
                                <i className={`fas ${file.isVault ? 'fa-lock' : 'fa-lock-open'}`}></i>
                            </div>

                            {/* Row 3 */}
                            <div className="icon-btn-circle expiry-v2" onClick={() => onSetExpiry(file._id)}>
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="icon-btn-circle watermark-v2" onClick={() => onWatermark(file._id)}>
                                <i className="fas fa-tint"></i>
                            </div>
                            {isPDF && (
                                <div className="icon-btn-circle split-v2" onClick={() => onSplitPDF(file._id)}>
                                    <i className="fas fa-cut"></i>
                                </div>
                            )}
                            {isPDF && (
                                <div className="icon-btn-circle sign-v2" onClick={() => onSign(file)}>
                                    <i className="fas fa-signature"></i>
                                </div>
                            )}
                             <div className="icon-btn-circle history-v2" onClick={() => onViewVersions(file)}>
                                <i className="fas fa-history"></i>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="ai-tools-group">
                            <div className="ai-buttons">
                                <button className="ai-action-btn summarize" onClick={handleSummarize} disabled={isSummarizing}>
                                    <i className={`fas ${isSummarizing ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                                    {aiSummary ? 'Summary Ready' : 'Summarize File'}
                                </button>
                                <button className={`ai-action-btn chat ${showChat ? 'active' : ''}`} onClick={() => setShowChat(!showChat)}>
                                    <i className="fas fa-comment-alt"></i>
                                    {showChat ? 'Hide Chat' : 'Chat with AI'}
                                </button>
                            </div>

                            {aiSummary && (
                                <div className="ai-summary-box-v2">
                                    <div className="box-header-v2">
                                        <i className="fas fa-robot"></i> AI INSIGHTS
                                    </div>
                                    <p>{aiSummary}</p>
                                </div>
                            )}

                            {showChat && (
                                <div className="ai-chat-box-v2">
                                    <div className="chat-content-v2">
                                        {chatAnswer && (
                                            <div className="ai-response">
                                                <div className="response-header">AI ASSISTANT</div>
                                                <p>{chatAnswer}</p>
                                            </div>
                                        )}
                                    </div>
                                    <form className="chat-form-v2" onSubmit={handleChat}>
                                        <input 
                                            value={chatQuestion} 
                                            onChange={(e) => setChatQuestion(e.target.value)} 
                                            placeholder="Ask anything about this document..."
                                        />
                                        <button disabled={isChatting}>
                                            <i className={`fas ${isChatting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                </>
            )}
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
          background: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
          backdrop-filter: blur(80px);
          box-shadow: var(--shadow-md);
        }
        
        .file-card:hover {
          transform: translateY(-5px);
          background: var(--bg-secondary);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-color);
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
          background: linear-gradient(45deg, var(--accent-color), var(--accent-hover));
          font-size: 48px;
          color: white;
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
          color: var(--text-primary);
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
          color: var(--text-secondary);
        }
        
        .meta-item i {
          width: 16px;
          color: var(--accent-color);
        }
        
        .file-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
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
          background: var(--input-bg);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }
        
        .favorite-btn.active, .favorite-btn:hover {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border-color: rgba(255, 193, 7, 0.3);
        }
        
        .pin-btn {
          background: var(--input-bg);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
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

        .version-btn { background: rgba(79, 70, 229, 0.1); color: #4f46e5; border: 1px solid rgba(79, 70, 229, 0.2); }
        .version-btn:hover { background: rgba(79, 70, 229, 0.3); }

        .sign-btn { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
        .sign-btn:hover { background: rgba(139, 92, 246, 0.2); }

        .resize-btn { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .resize-btn:hover { background: rgba(16, 185, 129, 0.2); }

        .rename-icon {
          margin-left: 8px;
          font-size: 0.8rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }
        .rename-icon:hover { color: var(--accent-color); }

        .secondary-actions {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid var(--border-color);
        }

        .version-btn { background: rgba(79, 70, 229, 0.1); color: #4f46e5; border: 1px solid rgba(79, 70, 229, 0.2); }
        .version-btn:hover { background: rgba(79, 70, 229, 0.2); }

        .sign-btn { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
        .sign-btn:hover { background: rgba(139, 92, 246, 0.2); }

        .resize-btn { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .resize-btn:hover { background: rgba(16, 185, 129, 0.2); }

        .rename-icon {
          margin-left: 8px;
          font-size: 0.8rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }
        .rename-icon:hover { color: var(--accent-color); }

        .secondary-actions {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid var(--border-color);
        }

        .vault-btn { background: rgba(96, 125, 139, 0.2); color: #607d8b; border: 1px solid rgba(96, 125, 139, 0.3); }
        .vault-btn:hover, .vault-btn.active { background: rgba(96, 125, 139, 0.3); color: #455a64; }

        .expiry-btn { background: rgba(255, 152, 0, 0.2); color: #ff9800; border: 1px solid rgba(255, 152, 0, 0.3); }
        .expiry-btn:hover { background: rgba(255, 152, 0, 0.3); }

        .watermark-btn { background: rgba(0, 188, 212, 0.2); color: #00bcd4; border: 1px solid rgba(0, 188, 212, 0.3); }
        .watermark-btn:hover { background: rgba(0, 188, 212, 0.3); }

        .split-btn { background: rgba(121, 85, 72, 0.2); color: #795548; border: 1px solid rgba(121, 85, 72, 0.3); }
        .split-btn:hover { background: rgba(121, 85, 72, 0.3); }

        .convert-btn { background: rgba(103, 58, 183, 0.2); color: #673ab7; border: 1px solid rgba(103, 58, 183, 0.3); }
        .convert-btn:hover { background: rgba(103, 58, 183, 0.3); }

        .crop-btn { background: rgba(233, 30, 99, 0.2); color: #e91e63; border: 1px solid rgba(233, 30, 99, 0.3); }
        .crop-btn:hover { background: rgba(233, 30, 99, 0.3); }

        .pdf-tool-btn { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
        .pdf-tool-btn:hover { background: rgba(59, 130, 246, 0.2); }

        .img-tool-btn { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border: 1px solid rgba(139, 92, 246, 0.2); }
        .img-tool-btn:hover { background: rgba(139, 92, 246, 0.2); }

        .ai-btn { background: rgba(236, 72, 153, 0.1); color: #ec4899; border: 1px solid rgba(236, 72, 153, 0.2); }
        .ai-btn.active, .ai-btn:hover { background: #ec4899; color: white; }

        .ai-chat-btn { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.2); }
        .ai-chat-btn.active, .ai-chat-btn:hover { background: #0ea5e9; color: white; }

        .action-tabs {
            display: flex;
            background: #f1f5f9;
            padding: 4px;
            border-radius: 12px;
            margin-bottom: 12px;
            gap: 4px;
        }
        .tab-btn {
            flex: 1;
            padding: 8px;
            border: none;
            background: transparent;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 700;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .tab-btn.active {
            background: white;
            color: #1e293b;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .doc-tools-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
            padding: 4px;
        }

        .icon-btn-circle {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1.5px solid rgba(0,0,0,0.05);
            text-decoration: none;
        }
        .icon-btn-circle:hover { transform: scale(1.1); }

        .share-v2 { color: #a855f7; background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.2); }
        .email-v2 { color: #3b82f6; background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
        .favorite-v2 { color: #64748b; background: rgba(100, 116, 139, 0.1); }
        .favorite-v2 i.filled { color: #f59e0b; }
        .pin-v2 { color: #0ea5e9; background: rgba(14, 165, 233, 0.1); }
        .rename-v2 { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
        
        .resize-v2 { color: #334155; background: white; border: 2px solid #e2e8f0; } /* White circle like image */
        .view-v2 { color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .download-v2 { color: #10b981; background: rgba(16, 185, 129, 0.1); }
        .delete-v2 { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
        .vault-v2 { color: #475569; background: rgba(71, 85, 105, 0.1); }

        .expiry-v2 { color: #f97316; background: rgba(249, 115, 22, 0.1); }
        .watermark-v2 { color: #06b6d4; background: rgba(6, 182, 212, 0.1); }
        .split-v2 { color: #64748b; background: rgba(100, 116, 139, 0.1); }
        .sign-v2 { color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }
        .history-v2 { color: #6366f1; background: rgba(99, 102, 241, 0.1); }

        .ai-tools-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .ai-buttons {
            display: flex;
            gap: 8px;
        }
        .ai-action-btn {
            flex: 1;
            padding: 10px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
        }
        .summarize { background: #ec4899; color: white; }
        .chat { background: #0ea5e9; color: white; }
        .chat.active { background: #0369a1; }

        .ai-summary-box-v2 {
            background: rgba(14, 165, 233, 0.05);
            border: 1px solid rgba(14, 165, 233, 0.2);
            padding: 12px;
            border-radius: 12px;
            font-size: 0.85rem;
            color: #f1f5f9;
            margin-top: 8px;
        }
        .box-header-v2 {
            font-weight: 800;
            color: #0ea5e9;
            font-size: 0.7rem;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ai-chat-box-v2 {
            background: #f0f9ff;
            border-radius: 12px;
            border: 1px solid #bae6fd;
            overflow: hidden;
        }
        .ai-response {
            padding: 12px;
            font-size: 0.85rem;
        }
        .response-header { font-weight: 800; color: #0284c7; font-size: 0.7rem; margin-bottom: 4px; }
        .chat-form-v2 {
            display: flex;
            padding: 8px;
            gap: 4px;
            background: white;
            border-top: 1px solid #bae6fd;
        }
        .chat-form-v2 input {
            flex: 1;
            border: none;
            padding: 8px;
            font-size: 0.85rem;
            outline: none;
        }
        .chat-form-v2 button {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
        }

        .trash-actions {
            display: flex;
            gap: 8px;
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

        .selection-overlay {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            cursor: pointer;
        }
        .checkbox {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            border: 2px solid rgba(255,255,255,0.8);
            background: rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            transition: all 0.2s;
        }
        .checkbox.checked {
            background: var(--brand-color, #0d9488);
            border-color: var(--brand-color, #0d9488);
        }

        .list-card {
            flex-direction: row;
            padding: 12px 20px;
            align-items: center;
            gap: 20px;
        }

        .list-card .card-media {
            width: 80px;
            height: 60px;
            border-radius: 12px;
            overflow: hidden;
            flex-shrink: 0;
            position: relative;
        }

        .list-card .file-content {
            padding: 0;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }

        .list-card .file-header {
            margin-bottom: 4px;
        }

        .list-card .file-meta {
            flex-direction: row;
            gap: 20px;
        }

        .list-card .file-actions {
            margin-top: 0;
            justify-content: flex-end;
        }

        .action-group {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .action-pill {
            padding: 8px 16px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 0.85rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        }

        .btn-restore {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        .btn-restore:hover { background: #10b981; color: white; }

        .btn-delete-perm {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        .btn-delete-perm:hover { background: #ef4444; color: white; }

        .ai-summary-box {
            background: var(--accent-glow);
            border: 1px solid var(--accent-color);
            padding: 12px;
            border-radius: 12px;
            margin: 10px 0;
            font-size: 0.9rem;
            color: var(--text-primary);
        }
        .ai-summary-box .box-header {
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--accent-color);
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ai-chat-box {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            margin: 10px 0;
            overflow: hidden;
        }

        .chat-input {
            display: flex;
            padding: 8px;
            gap: 8px;
            background: var(--input-bg);
        }
        .chat-input input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--text-primary);
            padding: 8px;
            font-size: 0.9rem;
            outline: none;
        }
        .chat-input button {
            background: var(--accent-color);
            color: white;
            border: none;
            width: 34px;
            height: 34px;
            border-radius: 8px;
            cursor: pointer;
        }

        .chat-messages {
            padding: 12px;
            font-size: 0.9rem;
            max-height: 200px;
            overflow-y: auto;
        }
        .chat-messages .answer {
            background: var(--card-bg);
            padding: 10px;
            border-radius: 10px;
            line-height: 1.5;
        }

        .tag-overlay {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 6px;
            flex-direction: column;
            align-items: flex-end;
            z-index: 5;
        }

        .mini-tag {
            background: rgba(14, 165, 233, 0.9);
            color: white;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .list-tags {
            display: flex;
            gap: 8px;
            margin-left: 10px;
        }
        .list-tag {
            color: var(--accent-color);
            font-weight: 700;
            font-size: 0.8rem;
        }

      `}</style>
    </>
  );
}
