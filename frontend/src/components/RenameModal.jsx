import { useState } from "react";

export default function RenameModal({ isOpen, onClose, currentName, onRename, fileId }) {
  const [newName, setNewName] = useState(currentName);
  const [renaming, setRenaming] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName === currentName) {
      onClose();
      return;
    }

    setRenaming(true);
    const success = await onRename(fileId, newName);
    setRenaming(false);
    
    if (success) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Rename Document</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label htmlFor="new-filename">New File Name</label>
            <input
              id="new-filename"
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={renaming || !newName.trim() || newName === currentName}
              className="rename-btn"
            >
              {renaming ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Renaming...
                </>
              ) : (
                <>
                  <i className="fas fa-edit"></i>
                  Rename
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
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
          max-width: 450px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
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
          font-size: 18px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .modal-body label {
          display: block;
          margin-bottom: 8px;
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .modal-body input {
          width: 100%;
          padding: 12px 15px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 50px;
          color: var(--text-primary);
          font-size: 16px;
        }
        
        .modal-body input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid var(--border-color);
        }
        
        .cancel-btn, .rename-btn {
          padding: 10px 20px;
          border-radius: 50px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .cancel-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }
        
        .cancel-btn:hover {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .rename-btn {
          background: linear-gradient(45deg, var(--accent-color), var(--accent-hover));
          border: none;
          color: white;
          box-shadow: 0 4px 15px var(--accent-glow);
        }
        
        .rename-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--accent-glow);
        }
        
        .rename-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}