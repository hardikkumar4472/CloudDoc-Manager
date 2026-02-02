import { useState } from "react";

export default function EmailModal({ file, onClose, onSendEmail }) {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: `Check out this file: ${file?.filename || ""}`,
    message: `I wanted to share this file with you: ${file?.filename || ""}`
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await onSendEmail(file._id, emailData);
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
    setSending(false);
  };

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Send File via Email</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label>To:</label>
            <input
              type="email"
              name="to"
              value={emailData.to}
              onChange={handleChange}
              placeholder="recipient@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Subject:</label>
            <input
              type="text"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Message:</label>
            <textarea
              name="message"
              value={emailData.message}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={sending} className="send-btn">
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        
        .modal-content {
          background: var(--bg-secondary);
          border-radius: 15px;
          padding: 25px;
          width: 100%;
          max-width: 500px;
          border: 1px solid var(--border-color);
          backdrop-filter: blur(40px);
          box-shadow: var(--shadow-lg);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .modal-header h3 {
          color: var(--accent-color);
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          color: var(--text-primary);
        }
        
        .email-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
          padding: 12px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 30px;
          color: var(--text-primary);
          font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 10px;
        }
        
        .cancel-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 40px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .send-btn {
          padding: 10px 20px;
          background: rgba(76, 175, 80, 0.3);
          border: 1px solid rgba(76, 175, 80, 0.5);
          border-radius: 40px;
          color: #4caf50;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .send-btn:hover:not(:disabled) {
          background: rgba(76, 175, 80, 0.4);
        }
        
        .send-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}