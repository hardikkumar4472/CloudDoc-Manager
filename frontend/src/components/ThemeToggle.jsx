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
          bottom: 30px; /* Moved to bottom right to avoid navbar conflict */
          top: auto;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary); /* Solid background */
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2000;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }
        
        .theme-toggle-btn:hover {
          transform: rotate(15deg) scale(1.1);
          border-color: var(--accent-color);
          color: var(--accent-color);
          box-shadow: 0 0 15px var(--accent-glow);
        }
        
        .theme-toggle-btn i {
          font-size: 20px;
        }

        /* Adjust position for Dashboard to avoid overlapping with user menu/logout */
        .theme-toggle-btn.dashboard-mode {
          right: 80px; /* Move left of the logout/user section */
        }
        
        @media (max-width: 768px) {
          .theme-toggle-btn {
            bottom: 20px;
            top: auto;
            right: 20px;
            width: 45px;
            height: 45px;
          }

          /* On mobile dashboard, move it further left or below */
          .theme-toggle-btn.dashboard-mode {
            top: 15px;
            right: 70px; /* Ensure it clears the logout button in header */
          }
        }
      `}</style>
    </button>
  );
}
