import { useState } from "react";

export default function ShareModal({ file, onClose, onShare, onRevoke }) {
  const [expiresIn, setExpiresIn] = useState(86400); 
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [error, setError] = useState("");

  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await onShare(file._id, expiresIn);
      setShareData(response.data);
    } catch (error) {
      console.error("Error generating share link:", error);
      setError(error.response?.data?.message || "Failed to generate share link");
    }
    setLoading(false);
  };

  const handleRevokeLink = async () => {
    setLoading(true);
    setError("");
    try {
      await onRevoke(file._id);
      setShareData(null);
      alert("Share link revoked successfully");
    } catch (error) {
      console.error("Error revoking share link:", error);
      setError(error.response?.data?.message || "Failed to revoke share link");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareData?.shareUrl || `${window.location.origin}/share/${file.shareToken}`);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Share "{file.filename}"</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          {!shareData && !file.shareToken ? (
            <>
              <div className="share-options">
                <h4>Create Share Link</h4>
                <div className="form-group">
                  <label>Link Expiration</label>
                  <select 
                    value={expiresIn} 
                    onChange={(e) => setExpiresIn(parseInt(e.target.value))}
                    className="form-select"
                  >
                    <option value={3600}>1 Hour</option>
                    <option value={86400}>24 Hours</option>
                    <option value={604800}>7 Days</option>
                    <option value={2592000}>30 Days</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleGenerateLink} 
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-link"></i>
                      Generate Share Link
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="share-result">
              <h4>Share Link Created</h4>
              <div className="share-url">
                <input 
                  type="text" 
                  value={shareData?.shareUrl || `${window.location.origin}/share/${file.shareToken}`}
                  readOnly 
                  className="url-input"
                />
                <button onClick={copyToClipboard} className="btn btn-secondary">
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              
              {shareData?.expiresAt && (
                <p className="expiry-info">
                  Expires: {new Date(shareData.expiresAt).toLocaleString()}
                </p>
              )}
              
              <div className="share-actions">
                <button 
                  onClick={handleRevokeLink} 
                  disabled={loading}
                  className="btn btn-danger"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Revoking...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-ban"></i>
                      Revoke Link
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
          }
          
          .modal {
            background: rgba(255, 255, 255, 0);
            backdrop-filter: blur(40px);
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            width: 100%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
          }
          
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .modal-header h3 {
            margin: 0;
            color: #4fc3f7;
          }
          
          .close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
          }
          
          .modal-content {
            padding: 20px;
          }
          
          .error-message {
            background: rgba(255, 59, 48, 0.2);
            color: #ff3b30;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            color: rgba(255, 255, 255, 0.8);
          }
          
          .form-select {
            width: 100%;
            padding: 10px;
            background: rgba(0, 0, 0, 0);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            color: #fff;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 16px;
          }
          
          .form-select option {
            background: #000000;
            color: #fff;
            padding: 10px;
            
          }
          
          .btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: none;
            border-radius: 40px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .btn-primary {
            background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
            color: #030303ff;
          }
          
          .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 195, 247, 0.4);
          }
          
          .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .btn-danger {
            background: rgba(255, 59, 48, 0.2);
            color: #ff3b30;
            border: 1px solid rgba(255, 59, 48, 0.3);
          }
          
          .btn-danger:hover {
            background: rgba(255, 59, 48, 0.3);
          }
          
          .share-url {
            display: flex;
            gap: 10px;
            margin: 20px 0;
          }
          
          .url-input {
            flex: 1;
            padding: 10px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 40px;
            color: #fff;
          }
          
          .expiry-info {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-bottom: 20px;
          }
          
          .share-actions {
            display: flex;
            gap: 10px;
          }
          
          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
}
