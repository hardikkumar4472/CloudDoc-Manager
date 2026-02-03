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
  onCropImage,
  onToggleSelect,
  onMergePDFs,
  onExportAll,
  onBulkTrash,
  viewMode = 'grid',
  onChat,
  onRestore,
  onDeletePermanent,
  onSummarize,
  selectedFileIds,
  setViewMode,
  onSign
}) {
  const selectedPDFCount = files.filter(f => selectedFileIds.includes(f._id) && f.filename.toLowerCase().endsWith('.pdf')).length;
  const isTrashView = activeFilter === 'trash';
  return (
    <div className="files-section">
      <div className="section-header">
        <div className="section-title-wrapper">
            <div className="title-info">
                <div className="main-heading">
                    <h3><i className="fas fa-folder-open"></i> Your Documents</h3>
                </div>
                <div className="stats-badges">
                    <span className="file-count-badge">
                        <i className="fas fa-file"></i> {files.length} {files.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>
            </div>
            
            <div className="actions-toolbar">
                <div className="toolbar-glass">
                    <button className="btn-premium btn-export" onClick={onExportAll} title="Download all files as ZIP">
                        <div className="btn-content">
                            <i className="fas fa-cloud-download-alt"></i>
                            <span>Export All</span>
                        </div>
                        <div className="gloss-shine"></div>
                    </button>
                    
                    <div className="divider-v"></div>

                    <div className="view-toggle">
                        <button 
                          className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                          onClick={() => setViewMode('grid')}
                          title="Grid View"
                        >
                            <i className="fas fa-th-large"></i>
                        </button>
                        <button 
                          className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                          onClick={() => setViewMode('list')}
                          title="List View"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>

                    {(selectedFileIds.length > 0 || selectedPDFCount > 1) && (
                        <div className="divider-v"></div>
                    )}

                    {selectedFileIds.length > 0 && !isTrashView && (
                         <button 
                            onClick={() => onBulkTrash(selectedFileIds)}
                            className="action-pill btn-danger"
                            title="Move selected to Trash"
                         >
                             <i className="fas fa-trash"></i>
                             <span>Delete {selectedFileIds.length}</span>
                         </button>
                    )}

                    {selectedPDFCount > 1 && (
                        <button 
                          onClick={() => onMergePDFs(selectedFileIds.filter(id => files.find(f => f._id === id)?.filename.toLowerCase().endsWith('.pdf')))}
                          className="btn-premium btn-merge"
                        >
                            <div className="btn-content">
                                <i className="fas fa-layer-group"></i>
                                <span>Merge {selectedPDFCount} PDFs</span>
                            </div>
                            <div className="gloss-shine"></div>
                            <div className="badge-glow"></div>
                        </button>
                    )}
                </div>
            </div>
        </div>
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
            <button 
              className={`filter-tab ${activeFilter === "trash" ? "active" : ""}`}
              onClick={() => setActiveFilter("trash")}
            >
              <i className="fas fa-trash-alt"></i> Trash
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
              : activeFilter === "trash"
              ? "Recycle Bin is empty. Trashed files appear here."
              : "No pinned documents yet. Pin files to see them here."}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'list' ? 'list-view' : 'grid-view'}>
          {files.map(file => (
            <FileCard
              key={file._id}
              file={file}
              viewMode={viewMode}
              isTrashView={isTrashView}
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
              onToggleVault={onToggleVault}
              onSetExpiry={onSetExpiry}
              onWatermark={onWatermark}
              onConvertImage={onConvertImage}
              onSplitPDF={onSplitPDF}
              onCropImage={onCropImage}
              isSelected={selectedFileIds.includes(file._id)}
              onToggleSelect={onToggleSelect}
              onRestore={onRestore}
              onDeletePermanent={onDeletePermanent}
              onSummarize={onSummarize}
              onChat={onChat}
              onSign={onSign}
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
            grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
          }
        }
        
        .section-title-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 12px;
        }

        .title-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .main-heading {
            display: flex;
            align-items: baseline;
            gap: 12px;
        }

        .main-heading h3 {
            font-size: 1.8rem !important;
            font-weight: 800 !important;
            margin: 0 !important;
            background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .sync-status {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        .pulse-dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px #10b981;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .stats-badges {
            display: flex;
            gap: 8px;
            margin-top: 4px;
        }

        .file-count-badge {
            font-size: 0.8rem;
            color: var(--accent-color);
            background: var(--accent-glow);
            padding: 4px 10px;
            border-radius: 8px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .toolbar-glass {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            padding: 6px;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
        }

        .divider-v {
            width: 1px;
            height: 24px;
            background: var(--border-color);
            margin: 0 4px;
        }

        .btn-premium {
            position: relative;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            background: transparent;
            padding: 0;
        }

        .btn-premium .btn-content {
            padding: 10px 18px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 0.85rem;
            color: white;
            z-index: 2;
            position: relative;
        }

        .btn-export {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            box-shadow: 0 4px 12px rgba(29, 78, 216, 0.25);
        }

        .btn-merge {
            background: linear-gradient(135deg, #f43f5e, #be123c);
            box-shadow: 0 4px 12px rgba(190, 18, 60, 0.25);
        }

        .gloss-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
            pointer-events: none;
        }

        .btn-premium:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }

        .btn-export:hover { box-shadow: 0 6px 16px rgba(29, 78, 216, 0.4); }
        .btn-merge:hover { box-shadow: 0 6px 16px rgba(190, 18, 60, 0.4); }

        .btn-premium:active { transform: translateY(0); }

        @media (max-width: 768px) {
            .section-title-wrapper {
                flex-direction: column;
                align-items: stretch;
                gap: 16px;
            }
            .toolbar-glass {
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
            }
            .btn-premium { flex: 1; }
        }

        .view-toggle {
            display: flex;
            background: var(--input-bg);
            border-radius: 12px;
            padding: 2px;
            gap: 2px;
        }

        .toggle-btn {
            width: 34px;
            height: 34px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .toggle-btn.active {
            background: var(--card-bg);
            color: var(--accent-color);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .btn-danger {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 8px 14px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-danger:hover {
            background: #ef4444;
            color: white;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .grid-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          perspective: 1000px;
        }

        .list-view {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

      `}</style>
    </div>
  );
}