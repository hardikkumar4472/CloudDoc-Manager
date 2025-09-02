import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MainPage() {
  const [isHovered, setIsHovered] = useState({ login: false, register: false });
  
  // Background particle effect
  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 80;
    
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

  return (
    <div className="main-container">
      {/* Background elements */}
      <canvas id="particle-canvas" className="particle-background"></canvas>
      <div className="glow-effect"></div>
      <div className="glow-effect-2"></div>
      
      {/* Main content */}
      <div className="content-wrapper">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h1>CloudDoc<span>Saver</span></h1>
        </div>
        
        <div className="hero-section">
          <h2>Secure Document Management in the Cloud</h2>
          <p>Store, manage, and access your documents from anywhere with encryption and seamless collaboration features.</p>
          
          <div className="feature-highlights">
            <div className="feature">
              <i className="fas fa-lock"></i>
              <span>2 Factor Authorization</span>
            </div>
            <div className="feature">
              <i className="fas fa-bolt"></i>
              <span>Lightning Fast</span>
            </div>
            <div className="feature">
              <i className="fas fa-infinity"></i>
              <span>Completely Free</span>
            </div>
          </div>
        </div>
        
        <div className="main-buttons">
          <Link 
            to="/login" 
            className={`btn btn-login ${isHovered.login ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered({...isHovered, login: true})}
            onMouseLeave={() => setIsHovered({...isHovered, login: false})}
          >
            <span>Login</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
          
          <Link 
            to="/register" 
            className={`btn btn-register ${isHovered.register ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered({...isHovered, register: true})}
            onMouseLeave={() => setIsHovered({...isHovered, register: false})}
          >
            <span>Get Started</span>
            <i className="fas fa-user-plus"></i>
          </Link>
        </div>
        
        <div className="security-badge">
          <i className="fas fa-shield-alt"></i>
          <p>
   End-to-End Encryption • Secure Document Sharing • 
   Cloud Backup • 
   GDPR & SOC2 Compliant
</p>
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
        
        .main-container {
          min-height: 100vh;
          width: 100%;
          background: linear-gradient(135deg, #0a0e17 0%, #1a2639 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
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
        
        .content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0 auto;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }
        
        .logo {
          margin-bottom: 60px;
          animation: fadeInDown 1s ease;
        }
        
        .logo-icon {
          font-size: 50px;
          color: #4fc3f7;
          margin-bottom: 15px;
        }
        
        .logo h1 {
          font-size: 42px;
          font-weight: 700;
          background: linear-gradient(to right, #4fc3f7, #6ab0e6, #a174db);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }
        
        .logo h1 span {
          font-weight: 300;
        }
        
        .hero-section {
          max-width: 800px;
          margin-bottom: 60px;
          animation: fadeInUp 1s ease 0.3s both;
        }
        
        .hero-section h2 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 20px;
          line-height: 1.3;
        }
        
        .hero-section p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 40px;
        }
        
        .feature-highlights {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          width: 100%;
        }
        
        .feature {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 12px 20px;
          border-radius: 50px;
          transition: all 0.3s ease;
        }
        
        .feature:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .feature i {
          color: #4fc3f7;
          margin-right: 8px;
          font-size: 16px;
        }
        
        .feature span {
          font-size: 14px;
          font-weight: 500;
        }
        
        .main-buttons {
          display: flex;
          gap: 20px;
          margin-bottom: 60px;
          animation: fadeInUp 1s ease 0.6s both;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 160px;
        }
        
        .btn span {
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .btn i {
          margin-left: 8px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .btn-login {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        
        .btn-login:hover {
          background: rgba(79, 195, 247, 0.2);
          border-color: rgba(79, 195, 247, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .btn-login.hovered i {
          transform: translateX(5px);
        }
        
        .btn-register {
          background: linear-gradient(45deg, #4fc3f7, #6ab0e6);
          color: #0a0e17;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(79, 195, 247, 0.3);
        }
        
        .btn-register:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(79, 195, 247, 0.4);
          background: linear-gradient(45deg, #6ab0e6, #4fc3f7);
        }
        
        .btn-register.hovered i {
          transform: scale(1.2);
        }
        
        .security-badge {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          padding: 15px 25px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          animation: fadeIn 1s ease 0.9s both;
          max-width: 90%;
        }
        
        .security-badge i {
          color: #4fc3f7;
          font-size: 20px;
          margin-right: 12px;
        }
        
        .security-badge p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
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
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
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
        
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 20px 15px;
          }
          
          .logo {
            margin-bottom: 40px;
          }
          
          .logo-icon {
            font-size: 40px;
          }
          
          .logo h1 {
            font-size: 32px;
          }
          
          .hero-section {
            margin-bottom: 40px;
          }
          
          .hero-section h2 {
            font-size: 28px;
          }
          
          .hero-section p {
            font-size: 16px;
            margin-bottom: 30px;
          }
          
          .feature-highlights {
            gap: 15px;
          }
          
          .feature {
            padding: 8px 15px;
          }
          
          .main-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            margin-bottom: 40px;
          }
          
          .btn {
            width: 100%;
          }
          
          .security-badge {
            flex-direction: column;
            text-align: center;
            padding: 12px 15px;
          }
          
          .security-badge i {
            margin-right: 0;
            margin-bottom: 8px;
          }
          
          .security-badge p {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-section h2 {
            font-size: 24px;
          }
          
          .feature-highlights {
            flex-direction: column;
            align-items: center;
          }
          
          .feature {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}