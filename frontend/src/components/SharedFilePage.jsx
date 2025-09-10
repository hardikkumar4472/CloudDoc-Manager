import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SharedFilePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessSharedFile = async () => {
      try {
        const response = await axios.get(
          `https://clouddoc-manager.onrender.com/api/docs/share/access/${token}`
        );
        setFile(response.data.document);
      } catch (err) {
        setError(err.response?.data?.message || "Share link revoked, Generate it again");
      } finally {
        setLoading(false);
      }
    };

    accessSharedFile();
  }, [token]);


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading shared file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="shared-file-container">
      <header className="shared-header">
        <h1>Shared File</h1>
      </header>

      <div className="shared-content">
        <div className="file-card">
          <div className="file-preview">
            {file.type?.startsWith('image/') ? (
              <img src={file.url} alt={file.filename} />
            ) : (
              <div className="file-icon">
                <i className={`fas fa-file-${getFileIcon(file.filename)}`}></i>
              </div>
            )}
          </div>

          <div className="file-info">
            <h2>{file.filename}</h2>
            <p>Size: {formatFileSize(file.size)}</p>
            <p>Shared on: {new Date(file.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="file-actions">
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <i className="fas fa-eye"></i>
              View File
            </a>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .shared-file-container {
          min-height: 100vh;
          min-width: 100vw;
          background: linear-gradient(135deg, #0a0e17 0%, #1a2639 100%);
          color: #fff;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        
        .shared-header {
          text-align: center;
          margin-bottom: 40px;
          flex-shrink: 0;
        }
        
        .shared-content {
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .file-card {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          width: 100%;
        }
        
        .file-preview {
          margin-bottom: 20px;
        }
        
        .file-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 10px;
        }
        
        .file-icon {
          font-size: 64px;
          color: #4fc3f7;
        }
        
        .file-info {
          margin-bottom: 30px;
        }
        
        .file-info h2 {
          margin-bottom: 10px;
          word-break: break-word;
        }
        
        .file-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          color: #0a0e17;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        
        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          min-width: 100vw;
          text-align: center;
          background: linear-gradient(135deg, #0a0e17 0%, #1a2639 100%);
          color: white;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left-color: #4fc3f7;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .shared-file-container {
            padding: 15px;
          }
          
          .file-card {
            padding: 20px;
          }
          
          .file-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

// Helper functions
function getFileIcon(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  const iconMap = {
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    xls: 'excel',
    xlsx: 'excel',
    ppt: 'powerpoint',
    pptx: 'powerpoint',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    txt: 'alt',
    zip: 'archive',
    rar: 'archive',
  };
  return iconMap[extension] || 'file';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
