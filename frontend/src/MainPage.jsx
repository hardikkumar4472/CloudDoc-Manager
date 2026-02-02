import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";

export default function MainPage() {
  const [showDeveloper, setShowDeveloper] = useState(false);
  const { theme } = useTheme();
  
  // Handle outside click for modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showDeveloper && e.target.className === 'modal-overlay') {
        setShowDeveloper(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showDeveloper]);

  return (
    <div className="main-container">
      {/* Delicate background */}
      <div className="bg-gradient-mesh"></div>
      
      {/* Navigation Layer */}
      <nav className="landing-nav">
        <div className="nav-inner">
            <div className="logo">
                <i className="fas fa-cubes"></i>
                <h1>CloudDoc</h1>
            </div>
            
            <div className="nav-links desktop-only">
                <button className="nav-link-btn" onClick={() => setShowDeveloper(true)}>Developer</button>
            </div>
            
            <div className="nav-buttons">
                <Link to="/login" className="nav-btn-login">Login</Link>
                <Link to="/register" className="nav-btn-primary">Sign Up</Link>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-grid">
        <div className="hero-text-side">
            <h1 className="display-title">
                Store, Resize, & <br />
                Convert Files <br />
                <span className="accent-text">in one secure place.</span>
            </h1>
            <p className="hero-desc">
                CloudDoc Manager is the ultimate tool to securely upload, manage, 
                and transform your documents. Resize images, convert PDFs, and share via email instantly.
            </p>
            
            <div className="hero-email-capture">
                <Link to="/register" className="btn-capture">
                    Start Managing Files Free <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
        </div>
        
        <div className="hero-visual-side">
             <div className="ui-mockup-card">
                 <div className="mockup-header">
                     <span className="dot red"></span>
                     <span className="dot yellow"></span>
                     <span className="dot green"></span>
                 </div>
                 <div className="mockup-body">
                    <img src="/assets/landing-hero.png" alt="CloudDoc Interface" className="mockup-img" />
                    
                    {/* Floating Cards */}
                    <div className="float-card card-visa">
                        <div className="file-icon"><i className="fas fa-file-pdf"></i></div>
                        <div className="file-info">
                            <span className="file-name">Report.pdf</span>
                            <span className="file-size">2.4 MB</span>
                        </div>
                    </div>
                    
                    <div className="float-card card-invoice">
                        <div className="invoice-icon"><i className="fas fa-cloud-upload-alt"></i></div>
                        <div>
                            <div className="inv-label">Upload Complete</div>
                            <div className="inv-amount">100%</div>
                        </div>
                    </div>
                 </div>
             </div>
        </div>
      </div>

      {/* Features Container */}
      <div className="features-container-outer">
        <div className="section-intro">
            <span className="mini-label">POWERFUL TOOLS</span>
            <h2>Experience that grows <br/> with your needs.</h2>
        </div>
        
        <div className="minimal-features-grid">
             {/* Feature 1 */}
             <div className="min-feature-item">
                 <div className="min-icon">
                    <img src="/assets/feature-storage.png" alt="Resize" />
                 </div>
                 <h3>Resize & Compress</h3>
                 <p>Optimize your images and PDFs on the fly. Save storage space without sacrificing quality.</p>
             </div>
             
             {/* Feature 2 */}
             <div className="min-feature-item">
                 <div className="min-icon">
                    <img src="/assets/feature-pdf.png" alt="Convert" />
                 </div>
                 <h3>Format Conversion</h3>
                 <p>Effortlessly convert documents between formats (JPG, PNG, PDF) with a single click.</p>
             </div>
             
             {/* Feature 3 */}
             <div className="min-feature-item">
                 <div className="min-icon">
                    <img src="/assets/feature-sharing.png" alt="Share" />
                 </div>
                 <h3>Secure Sharing</h3>
                 <p>Share files externally with time-limited links or send directly via email notifications.</p>
             </div>
        </div>
      </div>

      {/* Developer Modal */}
      {showDeveloper && (
        <div className="modal-overlay">
          <div className="developer-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowDeveloper(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="developer-content">
                <div className="dev-header">
                    <div className="dev-avatar-ring">
                         <div className="dev-avatar">
                             <i className="fas fa-code"></i>
                         </div>
                    </div>
                    <h3>Hardik Kumar</h3>
                    <span className="dev-role">Full Stack Architect</span>
                </div>
                
                <div className="dev-body">
                    <p>
                        Crafting digital experiences with a focus on security, scalability, and pixel-perfect design.
                    </p>
                    <div className="dev-skills">
                        <span>React</span><span>Node.js</span><span>Security</span><span>UX/UI</span>
                    </div>
                </div>

                <div className="dev-footer">
                    <a href="https://linkedin.com/in/hardik-kumar-63a4b3249/" target="_blank" rel="noopener noreferrer" className="social-btn linkedin">
                      <i className="fab fa-linkedin-in"></i> LinkedIn
                    </a>
                    <a href="https://github.com/hardikkumar4472" target="_blank" rel="noopener noreferrer" className="social-btn github">
                      <i className="fab fa-github"></i> GitHub
                    </a>
                </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="landing-footer">
        <div className="footer-content">
            <div className="footer-brand">
                <h4>CloudDoc</h4>
                <p>&copy; {new Date().getFullYear()} Secure Storage.</p>
            </div>
            <div className="footer-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Contact</a>
            </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
        
        :root {
            --primary-bg: #f5f7fa;
            --card-white: #ffffff;
            --text-dark: #1e293b;
            --text-gray: #64748b;
            --brand-color: #0d9488; /* Teal like the reference */
        }
        
        [data-theme='dark'] {
            --primary-bg: #0f172a;
            --card-white: #1e293b;
            --text-dark: #f8fafc;
            --text-gray: #94a3b8;
        }

        .main-container {
            min-height: 100vh;
            background: var(--primary-bg);
            color: var(--text-dark);
            font-family: 'DM Sans', sans-serif;
            overflow-x: hidden;
        }

        /* Navigation */
        .landing-nav {
            padding: 20px 0;
            width: 100%;
            position: fixed;
            top: 0;
            z-index: 1000;
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        [data-theme='dark'] .landing-nav { background: rgba(15, 23, 42, 0.8); border-bottom: 1px solid rgba(255,255,255,0.05); }

        .nav-inner {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 24px;
        }
        
        .logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 1.2rem; color: var(--text-dark); }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a, .nav-link-btn { color: var(--text-dark); text-decoration: none; font-weight: 500; cursor: pointer; background: none; border: none; font-family: inherit; font-size: 0.95rem; }
        .nav-buttons { display: flex; align-items: center; gap: 16px; }
        .nav-btn-login { color: var(--text-dark); font-weight: 500; text-decoration: none; }
        .nav-btn-primary { 
            background: var(--brand-color); color: white; padding: 10px 20px; 
            border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 0.95rem;
            transition: 0.2s;
        }
        .nav-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Hero Grid */
        .hero-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            max-width: 1200px;
            margin: 140px auto 100px;
            padding: 0 24px;
            align-items: center;
        }
        
        .display-title {
            font-size: 3.5rem;
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
            color: var(--text-dark);
        }
        .accent-text { color: var(--brand-color); }
        
        .hero-desc {
            font-size: 1.1rem;
            color: var(--text-gray);
            line-height: 1.6;
            margin-bottom: 32px;
            max-width: 480px;
        }
        
        /* Email Capture */
        .hero-email-capture {
            display: flex;
            gap: 12px;
            margin-bottom: 48px;
            max-width: 450px;
        }
        .hero-email-capture input {
            flex: 1;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            background: var(--card-white);
            color: var(--text-dark);
            outline: none;
        }
        .btn-capture {
            background: var(--brand-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            display: flex; align-items: center; gap: 8px;
        }
        
        .brand-strip {
            display: flex;
            gap: 32px;
            opacity: 0.6;
            font-weight: 700;
            font-size: 1.2rem;
            color: var(--text-dark);
            filter: grayscale(100%);
        }

        /* Hero Visual */
        .hero-visual-side { position: relative; }
        .ui-mockup-card {
            background: var(--card-white);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 30px 60px -12px rgba(0,0,0,0.1);
            position: relative;
        }
        .mockup-header { display: flex; gap: 8px; margin-bottom: 16px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .red { background: #fee2e2; } .yellow { background: #fef3c7; } .green { background: #dcfce7; }
        
        .mockup-img { width: 100%; border-radius: 12px; opacity: 0.9; }
        
        /* Floating Cards */
        .float-card {
            position: absolute;
            background: var(--card-white);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            padding: 12px;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 180px;
        }
        .card-visa {
            top: 40px; right: -30px;
            animation: float-y 4s infinite ease-in-out;
        }
        .file-icon {
            width: 40px; height: 40px;
            background: #ffe4e6;
            color: #f43f5e;
            border-radius: 8px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.2rem;
        }
        .file-info { display: flex; flex-direction: column; }
        .file-name { font-weight: 700; font-size: 0.9rem; color: var(--text-dark); }
        .file-size { font-size: 0.75rem; color: var(--text-gray); }

        .card-invoice {
            bottom: -20px; left: -20px;
            animation: float-y 4s infinite ease-in-out;
            animation-delay: 2s;
        }
        .invoice-icon { 
            width: 40px; height: 40px; background: #e0f2fe; color: #0284c7; 
            border-radius: 8px; display: flex; align-items: center; justify-content: center;
        }
        .inv-label { font-size: 0.75rem; color: var(--text-gray); }
        .inv-amount { font-weight: 700; color: var(--brand-color); font-size: 0.9rem; }
        
        @keyframes float-y {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        /* Features Section */
        .features-container-outer {
            max-width: 1200px;
            margin: 0 auto 100px;
            background: var(--card-white);
            border-radius: 32px;
            padding: 80px 60px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .section-intro { margin-bottom: 60px; }
        .mini-label { 
            color: var(--brand-color); font-weight: 700; font-size: 0.8rem; letter-spacing: 1px; 
            text-transform: uppercase; margin-bottom: 16px; display: block;
        }
        .section-intro h2 { font-size: 2.5rem; color: var(--text-dark); line-height: 1.2; }
        
        .minimal-features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
        }
        .min-feature-item { text-align: left; }
        .min-icon { width: 48px; height: 48px; margin-bottom: 24px; }
        .min-icon img { width: 100%; height: 100%; object-fit: contain; }
        .min-feature-item h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: 12px; color: var(--text-dark); }
        .min-feature-item p { color: var(--text-gray); line-height: 1.6; font-size: 0.95rem; }

        /* Modal Overlay */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 3000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .developer-modal { 
            width: 90%; max-width: 450px; 
            background: var(--card-white);
            border-radius: 24px; padding: 0; 
            animation: zoomIn 0.3s ease;
            overflow: hidden;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .dev-header { background: var(--bg-primary); padding: 40px 30px; text-align: center; }
        .dev-avatar-ring { width: 80px; height: 80px; margin: 0 auto 16px; background: var(--brand-color); border-radius: 50%; padding: 3px; }
        .dev-avatar { width: 100%; height: 100%; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; color: var(--brand-color); }
        .dev-body { padding: 30px; text-align: center; color: var(--text-dark); }
        
        .dev-skills span { 
            display: inline-block; padding: 4px 12px; margin: 4px; 
            background: var(--bg-primary); border-radius: 20px; font-size: 0.8rem; color: var(--text-gray);
        }
        .dev-footer { padding: 20px; background: var(--bg-primary); display: flex; justify-content: center; gap: 16px; }
        .social-btn { display: flex; align-items: center; gap: 8px; color: var(--text-gray); text-decoration: none; font-size: 0.9rem; }

        /* Footer */
        .landing-footer { border-top: 1px solid rgba(0,0,0,0.05); padding: 40px 0; margin-top: 80px; }
        .footer-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; padding: 0 24px; color: var(--text-gray); }
        .footer-links a { margin-left: 24px; text-decoration: none; color: var(--text-gray); }

        /* Responsive */
        @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr; margin-top: 100px; text-align: center; }
            .hero-email-capture { margin: 0 auto 40px; }
            .brand-strip { justify-content: center; }
            .hero-desc { margin: 0 auto 32px; }
            .minimal-features-grid { grid-template-columns: 1fr; }
            .nav-links { display: none; }
            .card-visa { right: 0; } 
            .card-invoice { left: 0; }
        }
      `}</style>
    </div>
  );
}
