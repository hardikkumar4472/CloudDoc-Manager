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
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: rgba(0, 0, 0, 0);
          border-radius: 40px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0);
        }
        
        .modal-header h3 {
          margin: 0;
          color: #4fc3f7;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
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
          color: #6ab0e6;
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          color: #fff;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: rgba(79, 195, 247, 0.5);
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }
        
        .cancel-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .resize-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          color: #0a0e17;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .resize-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 195, 247, 0);
        }
        
        .resize-info {
          background: rgba(79, 195, 247, 0.1);
          border-radius: 8px;
          padding: 15px;
          border-left: 4px solid #4fc3f7;
        }
        
        .resize-info p {
          margin: 5px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .resize-info i {
          color: #4fc3f7;
          margin-right: 8px;
          border-radius: 40px;
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