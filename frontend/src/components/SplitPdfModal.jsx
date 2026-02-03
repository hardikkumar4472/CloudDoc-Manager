import { useState } from "react";

export default function SplitPdfModal({ isOpen, onClose, file, onSplit }) {
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!range.trim()) {
        setError("Please enter page ranges.");
        return;
    }
    // Basic validation for range pattern (e.g., "1-5, 8, 10-12")
    const rangePattern = /^[\d\s,-]+$/;
    if (!rangePattern.test(range)) {
        setError("Invalid format. Use numbers, commas, and dashes (e.g., 1-5, 8).");
        return;
    }

    setLoading(true);
    setError("");
    await onSplit(file._id, range);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="split-modal">
        <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-header">
            <div className="icon-split">
                <i className="fas fa-cut"></i>
            </div>
            <h3>Split PDF</h3>
            <p className="file-name">{file?.filename}</p>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Page Ranges</label>
                <input 
                    type="text" 
                    placeholder="e.g. 1-3, 5, 8-10" 
                    value={range}
                    onChange={(e) => {
                        setRange(e.target.value);
                        setError("");
                    }}
                    className="range-input"
                />
                <small className="hint">
                    Enter page numbers or ranges separated by commas.
                </small>
            </div>

            {error && <p className="error-msg"><i className="fas fa-exclamation-circle"></i> {error}</p>}

            <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-split" disabled={loading}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : "Split PDF"}
                </button>
            </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        }

        .split-modal {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            width: 90%;
            max-width: 450px;
            padding: 2rem;
            border-radius: 24px;
            border: 1px solid var(--card-border);
            box-shadow: var(--shadow-lg);
            position: relative;
            color: var(--text-primary);
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            transition: color 0.2s;
        }
        .close-btn:hover { color: var(--text-primary); }

        .modal-header {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        .icon-split {
            width: 56px;
            height: 56px;
            background: rgba(234, 88, 12, 0.1); /* Orange tint */
            color: #ea580c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin: 0 auto 1rem;
        }

        .split-modal h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        .file-name {
            color: var(--text-secondary);
            font-size: 0.9rem;
            word-break: break-all;
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 1rem;
        }

        .input-group label {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-primary);
        }

        .range-input {
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            background: var(--input-bg);
            color: var(--text-primary);
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .range-input:focus {
            border-color: var(--brand-color, #0d9488);
            box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .hint {
            color: var(--text-muted);
            font-size: 0.8rem;
        }

        .error-msg {
            color: #ef4444;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 6px;
            justify-content: center;
        }

        .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 2rem;
        }

        .btn-cancel, .btn-split {
            flex: 1;
            padding: 12px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: transform 0.1s, filter 0.2s;
        }

        .btn-cancel {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
        }
        .btn-cancel:hover {
            background: rgba(0,0,0,0.05);
            color: var(--text-primary);
        }

        .btn-split {
            background: var(--brand-color, #0d9488);
            color: white;
            box-shadow: 0 4px 12px var(--accent-glow);
        }
        .btn-split:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }
        .btn-split:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
