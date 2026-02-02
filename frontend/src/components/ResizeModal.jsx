import { useState } from "react";

export default function ResizeModal({ file, onResize, onClose }) {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quality, setQuality] = useState("80");

  const handleSubmit = (e) => {
    e.preventDefault();
    onResize(file._id, width, height, quality);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Resize Image - {file.filename}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="resize-form">
            <div className="form-group">
              <label htmlFor="width">Width (px)</label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Original width"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Height (px)</label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Original height"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="quality">Quality (1-100)</label>
              <input
                type="number"
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                min="1"
                max="100"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="resize-btn">
                <i className="fas fa-expand-arrows-alt"></i> Resize & Download
              </button>
            </div>
          </form>
          
          <div className="resize-info">
            <p><i className="fas fa-info-circle"></i> Leave width or height empty to maintain aspect ratio.</p>
            <p><i className="fas fa-info-circle"></i> Quality only affects JPEG images.</p>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: var(--bg-secondary);
          border-radius: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
          margin: 0;
          color: var(--accent-color);
          font-weight: 600;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          color: var(--text-primary);
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .resize-form {
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: var(--accent-hover);
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 10px 15px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 40px;
          color: var(--text-primary);
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .cancel-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 30px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .resize-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(45deg, var(--accent-color), var(--accent-hover));
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px var(--accent-glow);
        }
        
        .resize-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--accent-glow);
        }
        
        .resize-info {
          background: var(--input-bg);
          border-radius: 8px;
          padding: 15px;
          border-left: 4px solid var(--accent-color);
        }
        
        .resize-info p {
          margin: 5px 0;
          font-size: 14px;
          color: var(--text-secondary);
        }
        
        .resize-info i {
          color: var(--accent-color);
          margin-right: 8px;
        }
        
        @media (max-width: 768px) {
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}