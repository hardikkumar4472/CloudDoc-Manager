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
        }
        
        .modal-content {
          background: #0d11172a;
          border-radius: 15px;
          padding: 25px;
          width: 100%;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(40px);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .modal-header h3 {
          color: #4fc3f7;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 18px;
          padding: 5px;
        }
        
        .close-btn:hover {
          color: #fff;
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
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
          padding: 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          color: #fff;
          font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4fc3f7;
        }
        
        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 10px;
        }
        
        .cancel-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.15);
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