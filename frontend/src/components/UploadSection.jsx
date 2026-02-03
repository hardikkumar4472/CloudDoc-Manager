export default function UploadSection({ file, setFile, uploading, handleUpload }) {
  return (
    <div className="upload-card">
      <h3>Upload New Document</h3>
      <div className="upload-area">
        <div className="file-input-container">
          <input 
            id="file-input"
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            className="file-input"
          />
          <label 
            htmlFor="file-input" 
            className="file-input-label"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderColor = 'var(--accent-color)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--input-bg)';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--input-bg)';
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <i className="fas fa-cloud-upload-alt"></i>
            {file ? (
              <span className="filename">
                <i className="fas fa-file" style={{ fontSize: '1rem', marginRight: '8px' }}></i>
                {file.name}
              </span>
            ) : (
              <>
                <span>Drag & drop your file here</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 400 }}>or click to browse</span>
              </>
            )}
          </label>
        </div>
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="upload-btn"
        >
          {uploading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Uploading...
            </>
          ) : (
            <>
              <i className="fas fa-upload"></i>
              Upload File
            </>
          )}
        </button>
      </div>

      <style>{`
        .upload-card {
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          padding: 24px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .upload-card h3 {
          margin-bottom: 20px;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          letter-spacing: -0.02em;
        }
        
        .upload-card h3::before {
          content: '';
          display: block;
          width: 4px;
          height: 18px;
          background: linear-gradient(to bottom, var(--accent-color), var(--accent-hover));
          border-radius: 10px;
        }
        
        .file-input {
          display: none;
        }

        .upload-area {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .file-input-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 30px 20px;
          background: rgba(255, 255, 255, 0.02);
          border: 2px dashed var(--border-color);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
        }
        
        .file-input-label:hover {
          background: rgba(var(--accent-rgb, 59, 130, 246), 0.05);
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }
        
        .file-input-label i {
          font-size: 2.5rem;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 4px;
        }
        
        .file-input-label span {
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .filename-v2 {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--input-bg);
          padding: 10px 16px;
          border-radius: 14px;
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          color: var(--accent-color);
          max-width: 100%;
          overflow: hidden;
        }

        .filename-v2 span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .upload-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(var(--accent-rgb, 59, 130, 246), 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(var(--accent-rgb, 59, 130, 246), 0.4);
        }
        
        .upload-btn:disabled {
          opacity: 0.5;
          filter: grayscale(0.5);
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}