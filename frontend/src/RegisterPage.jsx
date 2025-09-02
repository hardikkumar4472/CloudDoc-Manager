import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [step, setStep] = useState("register");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [isHovered, setIsHovered] = useState({ register: false, verify: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Background particle effect
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 60;
    
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
      ctx.fillStyle = '#0a0e17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 150, 255, ${particle.opacity})`;
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
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post(
  "https://clouddoc-manager.onrender.com/api/auth/register",
  form,
  {
    headers: { "Content-Type": "application/json" }
  }
);

      setStep("otp");
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      await axios.post("https://clouddoc-manager.onrender.com/api/auth/verify-register-otp", {
        email: form.email,
        otp
      });
      alert("Registration complete. Please login.");
      navigate("/login");
    } catch (error) {
      alert("OTP verification failed. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Background elements */}
      <canvas id="particle-canvas" className="particle-background"></canvas>
      <div className="glow-effect"></div>
      <div className="glow-effect-2"></div>
      
      <div className="auth-card">
        <Link to="/" className="back-home">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        
        <div className="auth-header">
          <div className="logo-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h2>Create Your Account</h2>
          <p>{step === "register" ? "Join CloudDocSaver today" : "Verify your email address"}</p>
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
          font-family: 'Poppins', sans-serif;
        }
        
        html, body, #root {
          height: 100%;
          width: 100%;
        }
        
        .auth-container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #0a0e17 0%, #1a2639 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .particle-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
        
        .glow-effect {
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(41, 128, 185, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
          top: -250px;
          right: -250px;
          z-index: 1;
        }
        
        .glow-effect-2 {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(106, 176, 230, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
          bottom: -200px;
          left: -200px;
          z-index: 1;
        }
        
        .auth-card {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.00);
          backdrop-filter: blur(60px);
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease;
        }
        
        .back-home {
          display: inline-flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        
        .back-home:hover {
          color: #4fc3f7;
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
          color: #4fc3f7;
          margin-bottom: 15px;
        }
        
        .auth-header h2 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 10px;
          background: linear-gradient(to right, #4fc3f7, #6ab0e6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .auth-header p {
          color: rgba(255, 255, 255, 0.7);
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
          color: rgba(255, 255, 255, 0.7);
          z-index: 2;
        }
        
        .auth-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
        }
        
        .auth-input:focus {
          outline: none;
          border-color: rgba(79, 195, 247, 0.5);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
        }
        
        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .auth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          border-radius: 30px;
          border: none;
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          color: #0a0e17;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          gap: 8px;
        }
        
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 195, 247, 0.4);
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
          color: #4fc3f7;
          margin-bottom: 15px;
        }
        
        .otp-instructions p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          line-height: 1.5;
        }
        
        .resend-otp {
          text-align: center;
          margin-top: 10px;
        }
        
        .resend-otp p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }
        
        .text-btn {
          background: none;
          border: none;
          color: #4fc3f7;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .auth-footer {
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
        }
        
        .auth-footer p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }
        
        .auth-link {
          color: #4fc3f7;
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
