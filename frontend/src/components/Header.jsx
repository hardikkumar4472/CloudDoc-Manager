export default function Header({ user, handleLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="brand">
          <i className="fas fa-cloud-upload-alt"></i>
          <h1>CloudDoc<span>Manager</span></h1>
        </div>
        
        <div className="user-menu">
          <div className="user-info">
            <div className="user-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-details">
              <span className="user-name">{user.name || 'User'}</span>
              <span className="user-email">{user.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <style>{`
        .dashboard-header {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
          width: 100%;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: all 0.3s ease;
        }
        
        [data-theme='light'] .dashboard-header {
            background: rgba(255, 255, 255, 0.7);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        .brand i {
          font-size: 28px;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 4px var(--accent-glow));
        }
        
        .brand h1 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--text-primary);
          margin: 0;
        }
        
        .brand span {
          color: var(--accent-color);
          font-weight: 400;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px 12px;
          background: var(--input-bg);
          border-radius: 30px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }
        
        .user-info:hover {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 2px 8px var(--accent-glow);
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
          padding-right: 8px;
        }
        
        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.2;
        }
        
        .user-email {
          font-size: 11px;
          color: var(--text-secondary);
        }
        
        .logout-btn {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
        
        @media (max-width: 768px) {
          .header-content {
            padding: 0 20px;
          }
          
          .brand h1 {
            font-size: 20px;
          }
          
          .user-name, .user-email {
            display: none;
          }
          
          .user-info {
            padding: 0;
            background: transparent;
            border: none;
          }
          
          .user-details {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
