import { useState } from "react";

export default function ImageConvertModal({ isOpen, onClose, file, onConfirm }) {
  const [format, setFormat] = useState("webp");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onConfirm(file._id, format);
    setLoading(false);
    onClose();
  };

  const formats = ["webp", "png", "jpeg"];

  return (
    <div className="modal-overlay">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        
        <div className="modal-header">
            <div className="icon-badge convert-icon">
                <i className="fas fa-exchange-alt"></i>
            </div>
            <h3>Convert Image</h3>
            <p className="file-name">{file?.filename}</p>
        </div>

        <form onSubmit={handleSubmit}>
            <p className="selection-label">Select Output Format:</p>
            <div className="format-selection">
                {formats.map(f => (
                    <label key={f} className={`format-option ${format === f ? 'active' : ''}`}>
                        <input 
                            type="radio" 
                            name="format" 
                            value={f} 
                            checked={format === f}
                            onChange={() => setFormat(f)}
                        />
                        <span className="radio-custom"></span>
                        <div className="format-info">
                            <span className="format-name">{f.toUpperCase()}</span>
                            <span className="format-desc">
                                {f === 'webp' ? 'Best for web & speed' : f === 'png' ? 'High quality (Lossless)' : 'Compressed & compatible'}
                            </span>
                        </div>
                    </label>
                ))}
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Convert Now"}
                </button>
            </div>
        </form>
      </div>

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .premium-modal { background: var(--card-bg); backdrop-filter: blur(20px); width: 95%; max-width: 440px; padding: 2.22rem; border-radius: 30px; border: 1px solid var(--card-border); box-shadow: 0 40px 80px rgba(0,0,0,0.4); position: relative; }
        .convert-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .icon-badge { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 1.5rem; }
        .modal-header { text-align: center; margin-bottom: 2rem; }
        .selection-label { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 12px; font-weight: 600; }
        
        .format-selection { display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem; }
        .format-option {
            display: flex; align-items: center; padding: 16px; border-radius: 16px; 
            background: var(--input-bg); border: 1px solid var(--border-color); cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); position: relative;
        }

        .format-option:hover { border-color: rgba(16, 185, 129, 0.5); transform: translateX(4px); }
        .format-option.active { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }

        .format-option input { position: absolute; opacity: 0; }
        .radio-custom { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border-color); margin-right: 16px; position: relative; flex-shrink: 0; }
        .format-option.active .radio-custom { border-color: #10b981; }
        .format-option.active .radio-custom::after {
            content: ''; position: absolute; top: 4px; left: 4px; width: 8px; height: 8px; border-radius: 50%; background: #10b981;
        }

        .format-info { display: flex; flex-direction: column; gap: 2px; }
        .format-name { font-weight: 700; color: var(--text-primary); }
        .format-desc { font-size: 0.75rem; color: var(--text-secondary); }

        .btn-primary { 
            background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; flex: 2; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.2s;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .btn-secondary { flex: 1; padding: 14px; border-radius: 14px; background: var(--input-bg); color: var(--text-primary); border: 1px solid var(--border-color); cursor: pointer; font-weight: 600; }
        .modal-actions { display: flex; gap: 12px; }
        .close-btn { position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; }
      `}</style>
    </div>
  );
}
