import { useState } from "react";

export default function WatermarkModal({ isOpen, onClose, file, onConfirm }) {
  const [text, setText] = useState("CONFIDENTIAL");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await onConfirm(file._id, text);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        
        <div className="modal-header">
            <div className="icon-badge watermark-icon">
                <i className="fas fa-stamp"></i>
            </div>
            <h3>Add Watermark</h3>
            <p className="file-name">{file?.filename}</p>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Watermark Text</label>
                <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter watermark text..."
                    className="premium-input"
                    autoFocus
                />
            </div>

            <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Apply Watermark"}
                </button>
            </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        .premium-modal {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            width: 90%;
            max-width: 400px;
            padding: 2rem;
            border-radius: 28px;
            border: 1px solid var(--card-border);
            box-shadow: 0 40px 80px rgba(0,0,0,0.4);
            position: relative;
            animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 1.1rem;
            cursor: pointer;
        }

        .icon-badge {
            width: 60px;
            height: 60px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin: 0 auto 1.2rem;
        }

        .watermark-icon {
            background: rgba(139, 92, 246, 0.15);
            color: #8b5cf6;
        }

        .modal-header { text-align: center; margin-bottom: 2rem; }
        .modal-header h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .file-name { color: var(--text-secondary); font-size: 0.9rem; }

        .input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.5rem; }
        .premium-input {
            padding: 14px 18px;
            border-radius: 14px;
            border: 1px solid var(--border-color);
            background: var(--input-bg);
            color: var(--text-primary);
            font-size: 1rem;
            outline: none;
            transition: all 0.2s;
        }
        .premium-input:focus {
            border-color: #8b5cf6;
            box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
        }

        .modal-actions { display: flex; gap: 12px; }
        .btn-secondary, .btn-primary {
            flex: 1;
            padding: 14px;
            border-radius: 14px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-secondary {
            background: var(--input-bg);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
        }

        .btn-primary {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        @keyframes modalPop {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
