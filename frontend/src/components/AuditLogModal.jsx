import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

export default function AuditLogModal({ onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/docs/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(res.data);
      } catch (error) {
        console.error("Logs fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'UPLOAD': return 'fa-cloud-upload-alt text-blue';
      case 'DOWNLOAD': return 'fa-download text-green';
      case 'DELETE_PERMANENT': return 'fa-trash-alt text-red';
      case 'SIGN': return 'fa-signature text-purple';
      case 'SHARE': return 'fa-share-alt text-orange';
      default: return 'fa-info-circle text-gray';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="audit-log-container">
        <div className="modal-header">
          <h3><i className="fas fa-history"></i> Activity Logs</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="logs-body">
          {loading ? (
            <div className="loader"><i className="fas fa-spinner fa-spin"></i> Loading activities...</div>
          ) : logs.length === 0 ? (
            <div className="empty-state">No recent activity found.</div>
          ) : (
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log._id} className="log-item">
                  <div className={`log-icon ${getActionIcon(log.action).split(' ').pop()}`}>
                    <i className={`fas ${getActionIcon(log.action).split(' ')[0]}`}></i>
                  </div>
                  <div className="log-info">
                    <div className="log-action-text">{log.details}</div>
                    <div className="log-meta">
                      <span><i className="far fa-clock"></i> {new Date(log.createdAt).toLocaleString()}</span>
                      {log.ip && <span><i className="fas fa-network-wired"></i> {log.ip}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .audit-log-container {
          background: white;
          width: 90%;
          max-width: 600px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          animation: slideIn 0.3s ease-out;
          display: flex;
          flex-direction: column;
          max-height: 80vh;
        }

        .logs-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .log-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s;
        }

        .log-item:hover { background: #f8fafc; }

        .log-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: #f1f5f9;
        }

        .text-blue { color: #3b82f6; background: #eff6ff; }
        .text-green { color: #10b981; background: #ecfdf5; }
        .text-red { color: #ef4444; background: #fef2f2; }
        .text-purple { color: #8b5cf6; background: #f5f3ff; }
        .text-orange { color: #f59e0b; background: #fffbeb; }

        .log-info { flex: 1; }
        .log-action-text { font-weight: 600; color: #1e293b; margin-bottom: 4px; }
        .log-meta { display: flex; gap: 15px; font-size: 0.75rem; color: #64748b; }

        .loader, .empty-state { text-align: center; padding: 40px; color: #64748b; }

        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
