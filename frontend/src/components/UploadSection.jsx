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
          <label htmlFor="file-input" className="file-input-label">
            <i className="fas fa-cloud-upload"></i>
            <span>{file ? file.name : 'Choose a file'}</span>
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
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 25px;
          margin-bottom: 30px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .upload-card h3 {
          margin-bottom: 20px;
          color: #4fc3f7;
          font-weight: 600;
          border-radius: 40px;
        }
        
        .upload-area {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
          width: 100%;
        }
        
        .file-input-container {
          flex: 1;
          min-width: 250px;
        }
        
        .file-input {
          display: none;
          border-radius: 40px;
        }
        
        .file-input-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
        }
        
        .file-input-label:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(79, 195, 247, 0.5);
        }
        
        .file-input-label i {
          color: #4fc3f7;
        }
        
        .upload-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          color: #0a0e17;
          border: none;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        
        .upload-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(79, 195, 247, 0.4);
        }
        
        .upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .upload-area {
            flex-direction: column;
          }
          
          .file-input-container {
            width: 100%;
          }
          
          .file-input-label {
            width: 100%;
          }
          
          .upload-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}