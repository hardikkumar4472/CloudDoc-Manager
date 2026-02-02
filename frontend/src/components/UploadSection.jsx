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
          -webkit-backdrop-filter: blur(16px);
          border-radius: 20px;
          border: 1px solid var(--border-color);
          padding: 30px;
          margin-bottom: 40px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease;
        }

        .upload-card h3 {
          margin-bottom: 25px;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .upload-card h3::before {
          content: '';
          display: block;
          width: 4px;
          height: 20px;
          background: linear-gradient(to bottom, var(--accent-color), var(--accent-hover));
          border-radius: 2px;
        }
        
        .upload-area {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          position: relative;
        }
        
        .file-input-container {
          width: 100%;
          position: relative;
        }
        
        .file-input {
          display: none;
        }
        
        .file-input-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
          padding: 40px 20px;
          background: var(--input-bg);
          border: 2px dashed var(--border-color);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
          min-height: 180px;
          text-align: center;
        }
        
        .file-input-label:hover {
          background: var(--bg-secondary);
          border-color: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        
        .file-input-label i {
          font-size: 3rem;
          color: var(--accent-color);
          opacity: 0.8;
          transition: transform 0.3s ease;
        }
        
        .file-input-label:hover i {
          transform: scale(1.1);
          opacity: 1;
        }
        
        .file-input-label span {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 500;
        }
        
        .file-input-label span.filename {
          color: var(--accent-color);
          background: var(--accent-glow);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px var(--accent-glow);
          align-self: flex-end;
          min-width: 150px;
        }
        
        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px var(--accent-glow);
          background: linear-gradient(135deg, var(--accent-hover), var(--accent-color));
        }
        
        .upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
          background: var(--border-color);
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .upload-btn {
            width: 100%;
          }
          
          .file-input-label {
             padding: 30px 15px;
             min-height: 150px;
          }
        }
      `}</style>
    </div>
  );
}