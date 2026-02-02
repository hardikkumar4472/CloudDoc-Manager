import { useState } from "react";
import jsPDF from "jspdf";

export default function DownloadImageAsPDF({ file, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!file.type.startsWith("image/")) {
      setError("This feature is only available for images.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const img = new Image();
      img.crossOrigin = "Anonymous"; 
      img.src = file.url;
      img.onload = () => {
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; 
        const scaleFactor = imgWidth / img.width;
        const imgHeight = img.height * scaleFactor;
        pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(`${file.filename.split('.')[0]}.pdf`);
        setLoading(false);
        if (onClose) onClose();
      };
      img.onerror = () => {
        setError("Failed to load the image. Please try again.");
        setLoading(false);
      };
    } catch (error) {
      console.error("Error converting image to PDF:", error);
      setError("Failed to convert image to PDF. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Download as PDF</h3>
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

          <div className="preview-container">
            <div className="image-preview">
              <img src={file.url} alt={file.filename} />
            </div>
            
            <div className="file-info">
              <h4>{file.filename}</h4>
              <p>Type: {file.type}</p>
              <p>Size: {formatFileSize(file.size)}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleDownload} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Converting...
                </>
              ) : (
                <>
                  <i className="fas fa-file-pdf"></i>
                  Download as PDF
                </>
              )}
            </button>
            
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
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
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            backdrop-filter: blur(5px);
          }
          
          .modal {
            background: var(--bg-secondary);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            border: 1px solid var(--border-color);
            width: 100%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            box-shadow: var(--shadow-lg);
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
          }
          
          .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            transition: all 0.3s ease;
          }
          
          .close-btn:hover {
            color: var(--text-primary);
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
          
          .preview-container {
            margin-bottom: 25px;
          }
          
          .image-preview {
            width: 100%;
            height: 200px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.2);
          }
          
          .image-preview img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 14px;
            
          }
          
          .file-info {
            text-align: center;
          }
          
          .file-info h4 {
            margin: 0 0 10px 0;
            word-break: break-word;
            color: var(--text-primary);
          }
          
          .file-info p {
            margin: 5px 0;
            color: var(--text-secondary);
            font-size: 14px;
          }
          
          .action-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
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
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
            box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
          }
          
          .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
          }
          
          .btn-secondary {
            background: transparent;
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
          }
          
          .btn-secondary:hover {
            background: var(--bg-primary);
            color: var(--text-primary);
          }
          
          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
          }
          
          @media (max-width: 600px) {
            .action-buttons {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
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