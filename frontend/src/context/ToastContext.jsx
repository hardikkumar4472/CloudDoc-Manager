import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, removeToast }) {
    if (toasts.length === 0) return null;

    return createPortal(
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast-item ${toast.type}`}>
                    <div className="toast-icon">
                        {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
                        {toast.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
                        {toast.type === 'info' && <i className="fas fa-info-circle"></i>}
                        {toast.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                    </div>
                    <div className="toast-message">{toast.message}</div>
                    <button className="toast-close" onClick={() => removeToast(toast.id)}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="toast-progress"></div>
                </div>
            ))}
            <style>{`
                .toast-container {
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 20000;
                    display: flex;
                    flex-direction: column-reverse;
                    gap: 12px;
                    align-items: center;
                    pointer-events: none;
                }

                .toast-item {
                    pointer-events: auto;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: var(--text-primary, #333);
                    padding: 12px 20px;
                    border-radius: 50px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 300px;
                    max-width: 90vw;
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    border: 1px solid rgba(255,255,255,0.5);
                    position: relative;
                    overflow: hidden;
                }
                
                @media (max-width: 768px) {
                    .toast-container {
                        bottom: 80px; /* Higher on mobile to be "mid" (or just above navs) */
                    }
                    .toast-item {
                        min-width: unset;
                        width: 90vw;
                    }
                }

                .toast-item.success { border-left: 4px solid #10b981; }
                .toast-item.error { border-left: 4px solid #ef4444; }
                .toast-item.info { border-left: 4px solid #3b82f6; }
                .toast-item.warning { border-left: 4px solid #f59e0b; }
                
                [data-theme='dark'] .toast-item {
                    background: rgba(30, 41, 59, 0.9);
                    color: #fff;
                    border-color: rgba(255,255,255,0.1);
                }

                .toast-icon {
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                }
                .success .toast-icon { color: #10b981; }
                .error .toast-icon { color: #ef4444; }
                .info .toast-icon { color: #3b82f6; }
                .warning .toast-icon { color: #f59e0b; }

                .toast-message {
                    font-size: 0.95rem;
                    font-weight: 500;
                    flex: 1;
                }

                .toast-close {
                    background: transparent;
                    border: none;
                    color: inherit;
                    opacity: 0.5;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                    align-items: center;
                    transition: opacity 0.2s;
                }
                .toast-close:hover { opacity: 1; }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(100px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>,
        document.body
    );
}
