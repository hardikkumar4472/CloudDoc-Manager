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
  onCompressPDF
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
            />
          ))}
        </div>
      )}

      <style>{`
        .files-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 25px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .section-header {
          margin-bottom: 25px;
          width: 100%;
        }
        
        .section-header h3 {
          color: #4fc3f7;
          font-weight: 600;
          margin-bottom: 15px;
        }
        
        .filters-search-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          width: 100%;
        }
        
        .filter-tabs {
          display: flex;
          gap: 10px;
        }
        
        .filter-tab {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }
        
        .filter-tab:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        
        .filter-tab.active {
          background: rgba(79, 195, 247, 0.2);
          border-color: rgba(79, 195, 247, 0.5);
          color: #4fc3f7;
        }
        
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-container i {
          position: absolute;
          left: 15px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-input {
          padding: 10px 15px 10px 40px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          color: #fff;
          width: 250px;
          box-sizing: border-box;
        }
        
        .search-input:focus {
          outline: none;
          border-color: rgba(79, 195, 247, 0.5);
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.7);
          width: 100%;
        }
        
        .empty-state i {
          font-size: 64px;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.3);
        }
        
        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .files-section {
            padding: 20px;
          }
          
          .filters-search-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-tabs {
            width: 100%;
            justify-content: center;
          }
          
          .search-input {
            width: 100%;
          }
          
          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .files-grid {
            grid-template-columns: 1fr;
          }
          
          .filter-tabs {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}