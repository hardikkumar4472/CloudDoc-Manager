import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { API_URL } from "./config";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  
  // 2FA States
  const [show2faModal, setShow2faModal] = useState(false);
  const [twoFactorOtp, setTwoFactorOtp] = useState("");
  const [pendingUserId, setPendingUserId] = useState(null);

  const navigate = useNavigate();
  const { theme } = useTheme();

  // 3D Tilt Logic
  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const rotateX = (0.5 - y) * 20;
    const rotateY = (x - 0.5) * 20;
    const glareX = x * 100;
    const glareY = y * 100;

    card.style.setProperty('--rotX', `${rotateX}deg`);
    card.style.setProperty('--rotY', `${rotateY}deg`);
    card.style.setProperty('--mx', `${glareX}%`);
    card.style.setProperty('--my', `${glareY}%`);
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.setProperty('--rotX', '0deg');
    e.currentTarget.style.setProperty('--rotY', '0deg');
    e.currentTarget.style.setProperty('--mx', '50%');
    e.currentTarget.style.setProperty('--my', '50%');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      
      if (res.data.twoFactorRequired) {
          setPendingUserId(res.data.userId);
          setShow2faModal(true);
          setIsLoading(false);
          return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FALogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
        const res = await axios.post(`${API_URL}/api/auth/login-2fa`, {
            userId: pendingUserId,
            token: twoFactorOtp
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
    } catch (error) {
        setMessage(error.response?.data?.msg || "Invalid 2FA code");
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Reset Password Functions
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/request-reset`, {
        email: resetEmail,
      });
      setMessage(res.data.msg);
      setResetStep(2);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: resetEmail,
        otp: resetOtp,
        newPassword,
      });
      setMessage(res.data.msg);
      setTimeout(() => {
        setShowResetModal(false);
        setResetStep(1);
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const openResetModal = () => {
    setShowResetModal(true);
    setResetStep(1);
    setResetEmail("");
    setResetOtp("");
    setNewPassword("");
    setMessage("");
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetStep(1);
    setResetEmail("");
    setResetOtp("");
    setNewPassword("");
    setMessage("");
  };

  return (
    <div className="login-container">
      {/* 3D Background Elements matching MainPage */}
      <div className="bg-3d-layer">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
      </div>
      <div className="bg-gradient-mesh"></div>
      
      {/* Main content */}
      <div className="login-content-wrapper">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        
        <div 
          className="login-card"
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
        >
          <div className="logo">
            <div className="logo-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <h1>CloudDoc<span>Manager</span></h1>
          </div>
          
          <h2>Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to access your secure documents
          </p>
          
          {message && (
            <div className={`message ${message.includes("failed") || message.includes("wrong") ? "error" : "success"}`}>
              <i className={`fas ${message.includes("failed") || message.includes("wrong") ? "fa-exclamation-circle" : "fa-check-circle"}`}></i>
              {message}
            </div>
          )}
          
          <div className="login-form">
            <div className="input-group">
              <i className="fas fa-envelope input-icon"></i>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input"
              />
            </div>
            
            <div className="input-group">
              <i className="fas fa-lock input-icon"></i>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="auth-input"
              />
            </div>
            
            <button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="auth-button login-btn"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Sign In"}
              {!isLoading && <i className="fas fa-arrow-right"></i>}
            </button>
            
            <div className="auth-links">
              <a href="#" onClick={openResetModal} className="forgot-link">Forgot password?</a>
              <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
            </div>
          </div>
          
          <div className="security-badge">
            <i className="fas fa-shield-alt"></i>
            <p>End to End Encryption • GDPR Compliant • SOC2 Certified</p>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="reset-modal">
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button className="modal-close" onClick={closeResetModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p className="reset-subtitle">
                {resetStep === 1
                  ? "Enter your email to receive an OTP"
                  : "Enter the OTP sent to your email and set a new password"}
              </p>
              
              {resetStep === 1 ? (
                <form onSubmit={handleRequestOtp} className="reset-form">
                  <div className="input-group">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-button reset-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                <form onSubmit={handleResetPassword} className="reset-form">
                  <div className="input-group">
                    <i className="fas fa-key input-icon"></i>
                    <input
                      type="text"
                      placeholder="Enter OTP code"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2faModal && (
        <div className="modal-overlay">
          <div className="reset-modal">
            <div className="modal-header">
              <h2>Security Check</h2>
              <button className="modal-close" onClick={() => setShow2faModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <p className="reset-subtitle">
                Two-Factor Authentication is enabled. Please enter the 6-digit code from your authenticator app.
              </p>
              
              <form onSubmit={handle2FALogin} className="reset-form">
                <div className="input-group">
                  <i className="fas fa-shield-alt input-icon"></i>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={twoFactorOtp}
                    onChange={(e) => setTwoFactorOtp(e.target.value)}
                    required
                    maxLength="6"
                    className="auth-input otp-field-v2"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Verify & Sign In"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .otp-field-v2 {
            font-family: monospace;
            font-size: 1.5rem !important;
            letter-spacing: 0.5em;
            text-align: center;
            font-weight: 800;
        }

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }
        
        :root {
            --brand-color: #0d9488;
            --text-primary: #1e293b;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --input-bg: rgba(255, 255, 255, 0.6);
            --border-color: #e2e8f0;
            --accent-color: #0d9488;
            --accent-hover: #0f766e;
            --accent-glow: rgba(13, 148, 136, 0.4);
            --card-bg: rgba(255, 255, 255, 0.9);
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
        }
        
        .login-container {
          min-height: 100vh;
          width: 100%;
          background: transparent;
          color: var(--text-primary);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .bg-3d-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .bg-gradient-mesh {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: -1;
            /* Simple mesh gradient */
            background: 
                radial-gradient(at 0% 0%, rgba(13, 148, 136, 0.1) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(13, 148, 136, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(162, 28, 175, 0.05) 0px, transparent 50%),
                radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.05) 0px, transparent 50%);
        }
        .shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            animation: floatShape 20s infinite linear;
        }
        .shape-1 {
            width: 400px; height: 400px;
            background: #ccfbf1;
            top: -100px; left: -100px;
            animation-duration: 25s;
        }
        .shape-2 {
            width: 300px; height: 300px;
            background: #e0f2fe;
            bottom: 10%; right: -50px;
            animation-duration: 30s;
            animation-direction: reverse;
        }
        @keyframes floatShape {
            0% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(30px, -50px) rotate(180deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        .login-content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 480px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        
        .back-home {
          position: absolute;
          top: 80px;
          left: 40px;
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .back-home:hover {
          color: var(--accent-color);
          transform: translateX(-5px);
        }
        
        .login-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 
                0 40px 80px -20px rgba(0,0,0,0.2),
                0 0 0 1px rgba(255,255,255,0.6) inset;
          
          /* 3D Transform Properties */
          transform-style: preserve-3d;
          perspective: 1000px;
          transform: rotateX(var(--rotX, 0deg)) rotateY(var(--rotY, 0deg));
          transition: transform 0.1s ease-out;
          position: relative;
        }
        
        /* Glare Effect */
        .login-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 20px;
            background: radial-gradient(
                circle at var(--mx, 50%) var(--my, 50%), 
                rgba(255,255,255,0.4) 0%, 
                rgba(255,255,255,0) 60%
            );
            opacity: 1;
            z-index: 20;
            pointer-events: none;
            mix-blend-mode: overlay;
        }

        /* Ensure form contents are on top of glare */
        .login-card > * { 
            position: relative; 
            z-index: 30; 
            transform: translateZ(20px); /* Pop out contents */
        }
        
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .logo-icon {
          font-size: 40px;
          color: var(--accent-color);
          margin-bottom: 10px;
        }
        
        .logo h1 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(to right, var(--accent-color), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }
        
        .login-card h2 {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 10px;
          color: var(--text-primary);
        }
        
        .login-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .message {
          padding: 12px 16px;
          border-radius: 20px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          animation: fadeIn 0.5s ease;
        }
        
        .message.error {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        
        .message.success {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .input-group {
          position: relative;
          margin-bottom: 20px;
        }
        
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          z-index: 2;
        }
        
        .auth-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border-radius: 40px;
          border: 1px solid var(--border-color);
          background: var(--input-bg);
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .auth-input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px var(--accent-glow);
          background: var(--input-bg);
        }
        
        .auth-input:hover {
          border-color: var(--accent-hover);
        }
        
        .auth-input::placeholder {
          color: var(--text-muted);
        }
        
        .auth-button {
          width: 100%;
          padding: 15px;
          border-radius: 40px;
          border: none;
          font-weight: 500;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }
        
        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .auth-button:not(:disabled):hover {
          transform: translateY(-2px);
        }
        
        .login-btn {
          background: linear-gradient(45deg, var(--accent-color), var(--accent-hover));
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 15px var(--accent-glow);
        }
        
        .login-btn:not(:disabled):hover {
          box-shadow: 0 8px 25px var(--accent-glow);
          background: linear-gradient(45deg, var(--accent-hover), var(--accent-color));
        }
        
        .auth-links {
          text-align: center;
          margin-top: 10px;
        }
        
        .forgot-link {
          color: var(--accent-color);
          text-decoration: none;
          font-size: 14px;
          display: block;
          margin-bottom: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .forgot-link:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }
        
        .auth-links p {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .auth-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .auth-link:hover {
          color: var(--accent-hover);
          text-decoration: underline;
        }
        
        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
          backdrop-filter: blur(10px);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          margin-top: 30px;
          gap: 10px;
        }
        
        .security-badge i {
          color: var(--accent-color);
          font-size: 16px;
        }
        
        .security-badge p {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        [data-theme='light'] .modal-overlay {
          background: rgba(255, 255, 255, 0.6);
        }
        
        .reset-modal {
          background: var(--bg-secondary);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          width: 100%;
          max-width: 450px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          animation: modalSlideIn 0.3s ease;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .modal-header h2 {
          color: var(--accent-color);
          font-weight: 600;
          font-size: 24px;
        }
        
        .modal-close {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .modal-close:hover {
          color: var(--text-primary);
          transform: rotate(90deg);
        }
        
        .reset-subtitle {
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .reset-form {
          display: flex;
          flex-direction: column;
        }
        
        .reset-btn {
          margin-top: 10px;
          margin-bottom: 0;
          background: linear-gradient(45deg, var(--accent-color), var(--accent-hover));
          color: #fff;
          font-weight: 600;
          box-shadow: 0 4px 15px var(--accent-glow);
        }
        
        .reset-btn:not(:disabled):hover {
          background: linear-gradient(45deg, var(--accent-hover), var(--accent-color));
          box-shadow: 0 8px 25px var(--accent-glow);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @media (max-width: 480px) {
          .back-home {
            top: 20px;
            left: 20px;
          }
          
          .login-card {
            padding: 30px 20px;
          }
          
          .logo-icon {
            font-size: 32px;
          }
          
          .logo h1 {
            font-size: 24px;
          }
          
          .login-card h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
