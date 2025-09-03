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
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px 0;
          width: 100%;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .brand i {
          font-size: 24px;
          color: #4fc3f7;
        }
        
        .brand h1 {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(to right, #4fc3f7, #6ab0e6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .brand span {
          font-weight: 300;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
        }
        
        .user-name {
          font-weight: 500;
          font-size: 14px;
        }
        
        .user-email {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </header>
  );
}
