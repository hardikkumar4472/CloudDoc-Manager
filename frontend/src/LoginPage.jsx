import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Background particle effect
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
    const particleColor = theme === 'dark' ? 'rgba(100, 150, 255,' : 'rgba(0, 119, 204,';
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor} ${particle.opacity})`;
        ctx.fill();
        
        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(drawParticles);
    }
    
    drawParticles();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
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
      const res = await axios.post("http://localhost:5000/api/auth/request-reset", {
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
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
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
      {/* Background elements */}
      <canvas id="particle-canvas" className="particle-background"></canvas>
      <div className="glow-effect"></div>
      
      {/* Main content */}
      <div className="login-content-wrapper">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        
        <div className="login-card">
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
        }
        
        .login-container {
          min-height: 100vh;
          width: 100%;
          background: var(--bg-gradient);
          color: var(--text-primary);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .particle-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .glow-effect {
          position: fixed;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--accent-glow) 0%, rgba(0, 0, 0, 0) 70%);
          top: -250px;
          right: -250px;
          z-index: 1;
          opacity: 0.5;
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
          background: var(--card-bg);
          backdrop-filter: blur(60px);
          border-radius: 20px;
          padding: 40px;
          width: 100%;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          animation: fadeInUp 0.8s ease;
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
