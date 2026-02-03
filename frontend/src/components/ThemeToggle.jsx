import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <button 
      className={`theme-toggle-btn ${isDashboard ? 'dashboard-mode' : ''}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun"></i>
      ) : (
        <i className="fas fa-moon"></i>
      )}
      
      <style>{`
        .theme-toggle-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, var(--card-bg), var(--bg-secondary));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999; /* Highest priority */
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 
            0 10px 25px -5px rgba(0, 0, 0, 0.2), 
            0 0 0 1px var(--border-color) inset;
        }
        
        .theme-toggle-btn:hover {
          transform: translateY(-5px) scale(1.1);
          color: var(--accent-color);
          box-shadow: 
            0 15px 30px -5px rgba(0, 0, 0, 0.3), 
            0 0 0 1px var(--accent-color) inset;
        }
        
        .theme-toggle-btn i {
          font-size: 22px;
          transition: transform 0.5s ease;
        }
        
        .theme-toggle-btn:hover i {
             transform: rotate(180deg);
        }

        @media (max-width: 768px) {
          .theme-toggle-btn {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
          }
        }
      `}</style>
    </button>
  );
}
