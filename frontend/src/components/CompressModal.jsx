import { useState } from "react";

export default function CompressModal({ file, onClose, onCompress }) {
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [compressing, setCompressing] = useState(false);

  const handleCompress = async () => {
    if (!file || !file._id) return;
    
    setCompressing(true);
    try {
      await onCompress(file._id, compressionLevel);
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setCompressing(false);
    }
  };

  const getCompressionDescription = (level) => {
    switch (level) {
      case "low":
        return "Smallest file size, lower quality";
      case "medium":
        return "Balanced size and quality";
      case "high":
        return "Larger file size, best quality";
      default:
        return "";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Compress PDF</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="file-info">
            <i className="fas fa-file-pdf"></i>
            <span className="filename">{file?.filename}</span>
            <span className="file-size">
              {file?.size ? formatFileSize(file.size) : "Unknown size"}
            </span>
          </div>

          <div className="compression-options">
            <h4>Select Compression Level</h4>
            
            <div className="compression-levels">
              <label className={`compression-option ${compressionLevel === "low" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="compressionLevel"
                  value="low"
                  checked={compressionLevel === "low"}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-title">Low Compression</span>
                  <span className="option-description">
                    {getCompressionDescription("low")}
                  </span>
                  <div className="quality-bar">
                    <div className="quality-indicator low"></div>
                  </div>
                </div>
              </label>

              <label className={`compression-option ${compressionLevel === "medium" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="compressionLevel"
                  value="medium"
                  checked={compressionLevel === "medium"}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-title">Medium Compression</span>
                  <span className="option-description">
                    {getCompressionDescription("medium")}
                  </span>
                  <div className="quality-bar">
                    <div className="quality-indicator medium"></div>
                  </div>
                </div>
              </label>

              <label className={`compression-option ${compressionLevel === "high" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="compressionLevel"
                  value="high"
                  checked={compressionLevel === "high"}
                  onChange={(e) => setCompressionLevel(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-title">High Quality</span>
                  <span className="option-description">
                    {getCompressionDescription("high")}
                  </span>
                  <div className="quality-bar">
                    <div className="quality-indicator high"></div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="compression-preview">
            <div className="preview-item original">
              <span>Original</span>
              <span className="file-size">{file?.size ? formatFileSize(file.size) : "Unknown"}</span>
            </div>
            
            <div className="preview-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
            
            <div className="preview-item compressed">
              <span>Compressed</span>
              <span className="file-size estimate">
                {compressionLevel === "low" && "~30-50% smaller"}
                {compressionLevel === "medium" && "~20-40% smaller"}
                {compressionLevel === "high" && "~10-20% smaller"}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={compressing}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleCompress}
            disabled={compressing}
          >
            {compressing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Compressing...
              </>
            ) : (
              <>
                <i className="fas fa-compress-alt"></i>
                Compress PDF
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: rgba(20, 25, 35, 0.95);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 25px 0;
          margin-bottom: 20px;
        }
        
        .modal-header h3 {
          color: #4fc3f7;
          font-weight: 600;
          margin: 0;
        }
        
        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
        
        .modal-body {
          padding: 0 25px;
        }
        
        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 25px;
        }
        
        .file-info i {
          font-size: 24px;
          color: #e74c3c;
        }
        
        .filename {
          flex: 1;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .file-size {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
        }
        
        .compression-options h4 {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 15px;
          font-weight: 500;
        }
        
        .compression-levels {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 25px;
        }
        
        .compression-option {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
        }
        
        .compression-option:hover {
          border-color: rgba(79, 195, 247, 0.3);
          background: rgba(79, 195, 247, 0.05);
        }
        
        .compression-option.selected {
          border-color: #4fc3f7;
          background: rgba(79, 195, 247, 0.1);
        }
        
        .compression-option input {
          margin-right: 12px;
        }
        
        .option-content {
          flex: 1;
        }
        
        .option-title {
          display: block;
          font-weight: 500;
          margin-bottom: 4px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .option-description {
          display: block;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
        }
        
        .quality-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .quality-indicator {
          height: 100%;
          transition: width 0.3s ease;
        }
        
        .quality-indicator.low {
          width: 30%;
          background: #e74c3c;
        }
        
        .quality-indicator.medium {
          width: 60%;
          background: #f39c12;
        }
        
        .quality-indicator.high {
          width: 85%;
          background: #27ae60;
        }
        
        .compression-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 25px;
        }
        
        .preview-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
        }
        
        .preview-item span:first-child {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .preview-item.compressed .file-size {
          color: #4fc3f7;
        }
        
        .preview-arrow {
          color: rgba(255, 255, 255, 0.3);
          padding: 0 20px;
        }
        
        .estimate {
          font-style: italic;
        }
        
        .modal-footer {
          display: flex;
          gap: 15px;
          padding: 20px 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-footer button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 40px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #4fc3f7, #6ab0e6);
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #6ab0e6, #4fc3f7);
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 480px) {
          .modal-content {
            margin: 10px;
            padding: 15px;
          }
          
          .modal-header {
            padding: 15px 15px 0;
          }
          
          .modal-body {
            padding: 0 15px;
          }
          
          .compression-preview {
            flex-direction: column;
            gap: 15px;
          }
          
          .preview-arrow {
            transform: rotate(90deg);
            padding: 0;
          }
          
          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}