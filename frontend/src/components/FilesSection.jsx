import FileCard from "./FileCard";

export default function FilesSection({
  files,
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  deletingId,
  togglingId,
  handleDelete,
  handleToggleFavorite,
  handleTogglePin,
  handleSearch,
  formatDate,
  formatFileSize,
  getFileThumbnail,
  onViewVersions,
  onResizeImage,
  handleRename,
  onShareFile,
  onDownloadAsPdf,
  onSendEmail,
  onCompressPDF,
  // New props
  onToggleVault,
  onSetExpiry,
  onWatermark,
  onConvertImage,
  onSplitPDF,
  onCropImage
}) {
  return (
    <div className="files-section">
      <div className="section-header">
        <h3>Your Documents</h3>
        <div className="filters-search-container">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Files
            </button>
            <button 
              className={`filter-tab ${activeFilter === "favorites" ? "active" : ""}`}
              onClick={() => setActiveFilter("favorites")}
            >
              <i className="fas fa-star"></i> Favorites
            </button>
            <button 
              className={`filter-tab ${activeFilter === "pinned" ? "active" : ""}`}
              onClick={() => setActiveFilter("pinned")}
            >
              <i className="fas fa-thumbtack"></i> Pinned
            </button>
            <button 
              className={`filter-tab ${activeFilter === "vault" ? "active" : ""}`}
              onClick={() => setActiveFilter("vault")}
            >
              <i className="fas fa-lock"></i> Vault
            </button>
          </div>
          <div className="search-container">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e.target.value);
              }}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <p>
            {activeFilter === "all" 
              ? "No documents yet. Upload your first file to get started!" 
              : activeFilter === "favorites"
              ? "No favorite documents yet. Mark files as favorites to see them here."
              : activeFilter === "vault"
              ? "Your vault is empty. Move sensitive files here."
              : "No pinned documents yet. Pin files to see them here."}
          </p>
        </div>
      ) : (
        <div className="files-grid">
          {files.map(file => (
            <FileCard
              key={file._id}
              file={file}
              deletingId={deletingId}
              togglingId={togglingId}
              handleDelete={handleDelete}
              handleToggleFavorite={handleToggleFavorite}
              handleTogglePin={handleTogglePin}
              formatDate={formatDate}
              formatFileSize={formatFileSize}
              getFileThumbnail={getFileThumbnail}
              onViewVersions={onViewVersions}
              onResizeImage={onResizeImage}
              onRename={handleRename}
              onShareFile={onShareFile}
              onDownloadAsPdf={onDownloadAsPdf}
              onSendEmail={onSendEmail}
              onCompressPDF={onCompressPDF}
              // New
              onToggleVault={onToggleVault}
              onSetExpiry={onSetExpiry}
              onWatermark={onWatermark}
              onConvertImage={onConvertImage}
              onSplitPDF={onSplitPDF}
              onCropImage={onCropImage}
            />
          ))}
        </div>
      )}

      <style>{`
        .files-section {
          background: transparent;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
        }
        
        .section-header {
          margin-bottom: 30px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 24px;
          border-radius: 24px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .section-header h3 {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.5rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-header h3::after {
          content: 'Manage';
          font-size: 0.8rem;
          background: var(--accent-glow);
          color: var(--accent-color);
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .filters-search-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          width: 100%;
        }
        
        .filter-tabs {
          display: flex;
          background: var(--input-bg);
          padding: 4px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
        }
        
        .filter-tab {
          padding: 10px 24px;
          background: transparent;
          border: none;
          border-radius: 12px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .filter-tab:hover {
          color: var(--text-primary);
        }
        
        .filter-tab.active {
          background: var(--card-bg);
          color: var(--accent-color);
          box-shadow: var(--shadow-sm);
          font-weight: 600;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 400px;
        }
        
        .search-container i {
          position: absolute;
          left: 16px;
          color: var(--accent-color);
          font-size: 1rem;
          pointer-events: none;
        }
        
        .search-input {
          padding: 14px 16px 14px 44px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          color: var(--text-primary);
          width: 100%;
          box-sizing: border-box;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--accent-color);
          background: var(--bg-secondary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--text-secondary);
          width: 100%;
          background: var(--card-bg);
          border-radius: 24px;
          border: 1px dashed var(--border-color);
        }
        
        .empty-state i {
          font-size: 4rem;
          margin-bottom: 24px;
          color: var(--text-muted);
          background: var(--input-bg);
          padding: 30px;
          border-radius: 50%;
        }
        
        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
          perspective: 1000px;
        }
        
        @media (max-width: 768px) {
          .section-header {
            padding: 20px;
          }

          .filters-search-container {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          
          .filter-tabs {
            width: 100%;
            justify-content: space-between;
          }
          
          .filter-tab {
            flex: 1;
            justify-content: center;
            padding: 10px;
            font-size: 0.9rem;
          }
          
          .search-container {
            max-width: 100%;
          }
          
          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
          }
        }
      `}</style>
    </div>
  );
}