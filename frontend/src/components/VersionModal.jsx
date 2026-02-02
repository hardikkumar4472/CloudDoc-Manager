export default function VersionModal({
  file,
  versionFile,
  setVersionFile,
  uploading,
  onUploadNewVersion,
  onRestoreVersion,
  onClose,
  formatDate
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Version History - {file.filename}</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="upload-version-section">
            <h4>Upload New Version</h4>
            <div className="version-upload-area">
              <div className="file-input-container">
                <input 
                  id="version-file-input"
                  type="file" 
                  onChange={(e) => setVersionFile(e.target.files[0])} 
                  className="file-input"
                />
                <label htmlFor="version-file-input" className="file-input-label">
                  <i className="fas fa-cloud-upload"></i>
                  <span>{versionFile ? versionFile.name : 'Choose a file'}</span>
                </label>
              </div>
              <button 
                onClick={onUploadNewVersion} 
                disabled={!versionFile || uploading}
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
                    Upload Version
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="versions-list">
            <h4>Previous Versions</h4>
            {file.versions && file.versions.length > 0 ? (
              <div className="versions-container">
                {file.versions.slice().reverse().map((version, index) => (
                  <div key={index} className="version-item">
                    <div className="version-info">
                      <div className="version-number">
                        Version {version.versionNumber}
                        {version.isRestorePoint && (
                          <span className="restore-badge">
                            <i className="fas fa-history"></i> Restored from v{version.restoredFrom}
                          </span>
                        )}
                      </div>
                      <div className="version-date">
                        {formatDate(version.uploadedAt)}
                      </div>
                    </div>
                    <div className="version-actions">
                      <a 
                        href={version.fileUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="action-btn view-btn"
                        title="View this version"
                      >
                        <i className="fas fa-eye"></i>
                      </a>
                      <button
                        onClick={() => onRestoreVersion(file._id, version.versionNumber)}
                        className="action-btn restore-btn"
                        title="Restore this version"
                      >
                        <i className="fas fa-undo"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-versions">No previous versions available.</p>
            )}
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
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        
        .modal-content {
          background: var(--bg-secondary);
          border-radius: 15px;
          width: 100%;
          max-width: 700px;
          max-height: 80vh;
          overflow-y: auto;
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
        
        .upload-version-section {
          margin-bottom: 30px;
        }
        
        .upload-version-section h4 {
          margin-bottom: 15px;
          color: var(--accent-hover);
        }
        
        .version-upload-area {
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .versions-list h4 {
          margin-bottom: 15px;
          color: var(--accent-hover);
        }
        
        .versions-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .version-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: var(--input-bg);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        
        .version-info {
          flex: 1;
        }
        
        .version-number {
          font-weight: 600;
          margin-bottom: 5px;
          color: var(--text-primary);
        }
        
        .restore-badge {
          background: rgba(106, 176, 230, 0.2);
          color: #6ab0e6;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 10px;
        }
        
        .version-date {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .version-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .view-btn {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
          text-decoration: none;
        }
        
        .view-btn:hover {
          background: rgba(76, 175, 80, 0.3);
        }
        
        .restore-btn {
          background: rgba(106, 176, 230, 0.2);
          color: #6ab0e6;
          border: 1px solid rgba(106, 176, 230, 0.3);
        }
        
        .restore-btn:hover {
          background: rgba(106, 176, 230, 0.3);
        }
        
        .no-versions {
          text-align: center;
          color: var(--text-secondary);
          padding: 20px;
        }
        
        @media (max-width: 768px) {
          .version-upload-area {
            flex-direction: column;
          }
          
          .version-item {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
          
          .version-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}