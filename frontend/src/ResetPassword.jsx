import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("https://clouddoc-manager.onrender.com/api/auth/request-reset", {
        email,
      });
      setMessage(res.data.msg);
      setStep(2); 
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) =>{
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("https://clouddoc-manager.onrender.com/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.msg);
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h2>Reset Password</h2>
          <p className="reset-password-subtitle">
            {step === 1
              ? "Enter your email to receive an OTP"
              : "Enter the OTP sent to your email and set a new password"}
          </p>
        </div>

        {message && (
          <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
            <i className={`fas ${message.includes("successfully") ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="reset-password-form">
            <div className="input-group">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <button
              type="submit"
              className="auth-button reset-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending OTP...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send OTP
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <div className="input-group">
              <i className="fas fa-key input-icon"></i>
              <input
                type="text"
                placeholder="Enter OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <div className="input-group">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <button
              type="submit"
              className="auth-button reset-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt"></i>
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}

        <div className="reset-password-footer">
          <p>
            Remember your password?{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              Sign In
            </span>
          </p>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .reset-password-container {
          min-height: 100vh;
          height: 100%;
          width: 100%;
          background: linear-gradient(135deg, #0a0e17 0%, #070707ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .reset-password-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 40px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          margin: 20px;
        }
        
        .reset-password-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .reset-password-header h2 {
          color: #4fc3f7;
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 28px;
        }
        
        .reset-password-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin: 0;
        }
        
        .reset-password-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .input-group {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 16px;
        }
        
        .auth-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          color: #fff;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .auth-input:focus {
          outline: none;
          border-color: #4fc3f7;
          background: rgba(255, 255, 255, 0.12);
        }
        
        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .auth-button {
          padding: 15px;
          border: none;
          border-radius: 40px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .reset-btn {
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          color: white;
        }
        
        .reset-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(79, 195, 247, 0.3);
        }
        
        .reset-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .message {
          padding: 15px;
          border-radius: 30px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }
        
        .message.success {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .message.error {
          background: rgba(244, 67, 54, 0.2);
          color: #4caf50;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }
        
        .reset-password-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .reset-password-footer p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 14px;
        }
        
        .auth-link {
          color: #4fc3f7;
          cursor: pointer;
          text-decoration: none;
          font-weight: 500;
        }
        
        .auth-link:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 480px) {
          .reset-password-card {
            padding: 30px 25px;
            margin: 15px;
          }
          
          .reset-password-header h2 {
            font-size: 24px;
          }
          
          .auth-input {
            padding: 12px 12px 12px 40px;
          }
          
          .auth-button {
            padding: 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
