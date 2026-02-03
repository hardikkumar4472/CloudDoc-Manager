import { useState } from "react";

export default function FileExpiryModal({ isOpen, onClose, file, onConfirm }) {
  const [hours, setHours] = useState("24");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(file._id, hours);
    setLoading(false);
    onClose();
  };

  const options = [
      { label: "1 Hour", value: "1" },
      { label: "12 Hours", value: "12" },
      { label: "1 Day", value: "24" },
      { label: "3 Days", value: "72" },
      { label: "1 Week", value: "168" },
      { label: "Remove Expiry", value: "0" }
  ];

  return (
    <div className="modal-overlay">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        
        <div className="modal-header">
            <div className="icon-badge expiry-icon">
                <i className="fas fa-hourglass-half"></i>
            </div>
            <h3>Self-Destruct Timer</h3>
            <p className="file-name">{file?.filename}</p>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="options-grid">
                {options.map(opt => (
                    <button 
                        key={opt.value}
                        type="button"
                        className={`option-btn ${hours === opt.value ? 'active' : ''}`}
                        onClick={() => setHours(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="custom-input-group">
                <label>Custom Hours</label>
                <input 
                    type="number" 
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="premium-input"
                />
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Set Expiry"}
                </button>
            </div>
        </form>
      </div>

      <style>{`
        /* Reuse common modal base styles or define locally */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
            z-index: 10000; display: flex; align-items: center; justify-content: center;
        }

        .premium-modal {
            background: var(--card-bg); backdrop-filter: blur(20px); width: 95%; max-width: 420px;
            padding: 2.2rem; border-radius: 30px; border: 1px solid var(--card-border);
            box-shadow: 0 40px 80px rgba(0,0,0,0.4); position: relative;
        }

        .expiry-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
        .icon-badge { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 1.5rem; }
        
        .modal-header { text-align: center; margin-bottom: 2rem; }
        .modal-header h3 { font-size: 1.6rem; font-weight: 800; }

        .options-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem;
        }

        .option-btn {
            padding: 12px; border-radius: 12px; border: 1px solid var(--border-color);
            background: var(--input-bg); color: var(--text-secondary); cursor: pointer;
            font-weight: 600; font-size: 0.9rem; transition: all 0.2s;
        }

        .option-btn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
        .option-btn.active {
            background: #f59e0b; color: white; border-color: #f59e0b;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .custom-input-group { margin-bottom: 2rem; }
        .custom-input-group label { display: block; font-size: 0.8rem; margin-bottom: 6px; color: var(--text-muted); }
        .premium-input { width: 100%; border-radius: 12px; padding: 12px; background: var(--input-bg); border: 1px solid var(--border-color); color: var(--text-primary); outline: none; }

        .btn-primary { 
            background: linear-gradient(135deg, #f59e0b, #d97706);  width: 100%; color: white;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .modal-actions { display: flex; gap: 12px; }
        .btn-secondary { flex: 1; }
        .btn-primary { flex: 2; }
        .close-btn { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; }
      `}</style>
    </div>
  );
}
