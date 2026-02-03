import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import { useToast } from "./context/ToastContext";
import { API_URL } from "./config";

export default function RegisterPage() {
  const [step, setStep] = useState("register");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [isHovered, setIsHovered] = useState({ register: false, verify: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToast } = useToast();

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

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        form,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      if (response.data.success) {
        setStep("otp");
      } else {
        addToast(response.data.message || "Registration failed", 'error');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        addToast(error.response.data.message || "Registration failed", 'error');
      } else {
        addToast("Network error. Please try again.", 'error');
      }
      console.error("Registration error:", error);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-register-otp`, {
        email: form.email,
        otp
      });
      addToast("Registration complete. Please login.", 'success');
      navigate("/login");
    } catch (error) {
      addToast("OTP verification failed. Please try again.", 'error');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Background elements */}
      {/* 3D Background Elements matching MainPage */}
      <div className="bg-3d-layer">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
      </div>
      <div className="bg-gradient-mesh"></div>
      
      <div 
          className="auth-card"
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
      >
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        
        <div className="auth-header">
          <div className="logo-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h2>Create Your Account</h2>
          <p>{step === "register" ? "Join CloudDocManager today" : "Verify your email address"}</p>
        </div>
        
        {step === "register" ? (
          <div className="form-container">
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            
            <div className="input-group">
              <i className="fas fa-phone"></i>
              <input 
                type="text" 
                name="phone" 
                placeholder="Phone Number" 
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            
            <button 
              onClick={handleRegister} 
              className={`auth-btn ${isHovered.register ? 'hovered' : ''}`}
              onMouseEnter={() => setIsHovered({...isHovered, register: true})}
              onMouseLeave={() => setIsHovered({...isHovered, register: false})}
              disabled={loading}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Create Account'}
              {!loading && <i className="fas fa-arrow-right"></i>}
            </button>
          </div>
        ) : (
          <div className="form-container">
            <div className="otp-instructions">
              <i className="fas fa-envelope-open-text"></i>
              <p>We've sent a 6-digit verification code to <strong>{form.email}</strong></p>
            </div>
            
            <div className="input-group">
              <i className="fas fa-key"></i>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="Enter OTP"
                className="auth-input"
                maxLength="6"
              />
            </div>
            
            <button 
              onClick={handleVerify} 
              className={`auth-btn verify-btn ${isHovered.verify ? 'hovered' : ''}`}
              onMouseEnter={() => setIsHovered({...isHovered, verify: true})}
              onMouseLeave={() => setIsHovered({...isHovered, verify: false})}
              disabled={loading}
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Verify & Continue'}
              {!loading && <i className="fas fa-check"></i>}
            </button>
          </div>
        )}
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
        </div>
      </div>

      <style>{`
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
        
        .auth-container {
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
        
        .auth-card {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 30px;
          width: 100%;
          max-width: 450px;
          box-shadow: 
                0 40px 80px -20px rgba(0,0,0,0.2),
                0 0 0 1px rgba(255,255,255,0.6) inset;
          
          /* 3D Transform Properties */
          transform-style: preserve-3d;
          perspective: 1000px;
          transform: rotateX(var(--rotX, 0deg)) rotateY(var(--rotY, 0deg));
          transition: transform 0.1s ease-out;
        }

        /* Glare Effect */
        .auth-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 30px;
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
        .auth-card > * { 
            position: relative; 
            z-index: 30; 
            transform: translateZ(20px); /* Pop out contents */
        }
        
        .back-home {
          display: inline-flex;
          align-items: center;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        
        .back-home:hover {
          color: var(--accent-color);
        }
        
        .back-home i {
          margin-right: 8px;
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .logo-icon {
          font-size: 40px;
          color: var(--accent-color);
          margin-bottom: 15px;
        }
        
        .auth-header h2 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 10px;
          background: linear-gradient(to right, var(--accent-color), var(--accent-hover));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .auth-header p {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-group i {
          position: absolute;
          left: 15px;
          color: var(--text-muted);
          z-index: 2;
        }
        
        .auth-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          background: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 30px;
          color: var(--text-primary);
          font-size: 15px;
          transition: all 0.3s ease;
        }
        
        .auth-input:focus {
          outline: none;
          border-color: var(--accent-color);
          background: var(--input-bg);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        
        .auth-input::placeholder {
          color: var(--text-muted);
        }
        
        .auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          border-radius: 30px;
          border: none;
          background: linear-gradient(45deg, var(--accent-color), var(--accent-hover));
          color: #fff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          gap: 8px;
        }
        
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px var(--accent-glow);
        }
        
        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .auth-btn.hovered i {
          transform: translateX(5px);
        }
        
        .verify-btn {
          background: linear-gradient(45deg, #4cd964, #34e89e);
        }
        
        .verify-btn:hover:not(:disabled) {
          box-shadow: 0 10px 25px rgba(76, 217, 100, 0.4);
        }
        
        .otp-instructions {
          text-align: center;
          margin-bottom: 10px;
        }
        
        .otp-instructions i {
          font-size: 40px;
          color: var(--accent-color);
          margin-bottom: 15px;
        }
        
        .otp-instructions p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.5;
        }
        
        .resend-otp {
          text-align: center;
          margin-top: 10px;
        }
        
        .resend-otp p {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .text-btn {
          background: none;
          border: none;
          color: var(--accent-color);
          cursor: pointer;
          text-decoration: underline;
        }
        
        .auth-footer {
          text-align: center;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
        
        .auth-footer p {
          color: var(--text-secondary);
          font-size: 14px;
        }
        
        .auth-link {
          color: var(--accent-color);
          text-decoration: none;
          font-weight: 500;
        }
        
        .auth-link:hover {
          text-decoration: underline;
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
        
        @media (max-width: 480px) {
          .auth-container {
            padding: 15px;
          }
          
          .auth-card {
            padding: 20px;
          }
          
          .auth-header h2 {
            font-size: 24px;
          }
          
          .auth-input {
            padding: 12px 12px 12px 40px;
          }
        }
      `}</style>
    </div>
  );
}
