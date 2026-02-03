import { useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function SignModal({ file, onClose, onSign }) {
  const [signatureName, setSignatureName] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleConfirm = async () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL("image/png");
    setLoading(true);
    await onSign(file._id, signatureData);
    setLoading(false);
    onClose();
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="sign-modal-premium">
        <div className="modal-header-v2">
          <h3>Digital Signature</h3>
          <p>Sign document: <b>{file.filename}</b></p>
        </div>

        <div className="signature-pad-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <button className="clear-sig" onClick={clearCanvas}>Clear</button>
        </div>

        <div className="modal-actions-v2">
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-premium-v2" onClick={handleConfirm} disabled={loading}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : "Sign & Download"}
          </button>
        </div>
      </div>

      <style>{`
        .sign-modal-premium {
          background: white;
          padding: 30px;
          border-radius: 24px;
          width: 90%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease-out;
        }

        .modal-header-v2 h3 { margin: 0 0 8px; font-size: 1.5rem; color: #1e293b; }
        .modal-header-v2 p { margin: 0 0 20px; color: #64748b; font-size: 0.9rem; }

        .signature-pad-container {
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          background: #f8fafc;
          position: relative;
          margin-bottom: 24px;
          cursor: crosshair;
        }

        canvas {
          display: block;
          width: 100%;
          height: auto;
          touch-action: none;
        }

        .clear-sig {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: #f1f5f9;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }

        .modal-actions-v2 {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-premium-v2 {
          background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-premium-v2:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(13, 148, 136, 0.3); }

        .btn-ghost {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
