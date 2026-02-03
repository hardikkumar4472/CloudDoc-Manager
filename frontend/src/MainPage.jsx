import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "./context/ThemeContext";

export default function MainPage() {
  const [showDeveloper, setShowDeveloper] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // Scroll Progress Handler
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Animation Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const rows = document.querySelectorAll('.feature-row');
    rows.forEach(row => observer.observe(row));

    return () => rows.forEach(row => observer.unobserve(row));
  }, []);

  // 3D Tilt & Lighting Logic
  const handleHeroMove = (e) => {
    const hero = e.currentTarget;
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    // Rotation
    const rotateX = (0.5 - y) * 30; // Increased range for drama
    const rotateY = (x - 0.5) * 30;

    // Glare Position (Opposite to mouse mostly, or tracking)
    const glareX = x * 100;
    const glareY = y * 100;

    hero.style.setProperty('--rotX', `${rotateX}deg`);
    hero.style.setProperty('--rotY', `${rotateY}deg`);
    hero.style.setProperty('--mx', `${glareX}%`);
    hero.style.setProperty('--my', `${glareY}%`);
  };

  const handleHeroLeave = (e) => {
    e.currentTarget.style.setProperty('--rotX', '0deg');
    e.currentTarget.style.setProperty('--rotY', '0deg');
  };

  return (
    <div className="main-container">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* 3D Background Elements */}
      <div className="bg-3d-layer">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
      </div>
      
      {/* Delicate background */}
      <div className="bg-gradient-mesh"></div>
      
      {/* Navigation Layer */}
      <nav className="landing-nav">
        <div className="nav-inner">
            <div className="logo">
                <i className="fas fa-cubes"></i>
                <h1>CloudDoc Manager</h1>
            </div>
            
            <div className="nav-links desktop-only">
                {/* Moved to footer */}
            </div>
            
            <div className="nav-buttons">
                <button className="nav-about-btn" onClick={() => setShowDeveloper(true)}>About Dev</button>
                <Link to="/login" className="nav-btn-login">Login</Link>
                <Link to="/register" className="nav-btn-primary">Sign Up</Link>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-grid" onMouseMove={handleHeroMove} onMouseLeave={handleHeroLeave}>
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
        
      {/* Detailed Features Section (Zig-Zag Layout) */}
      <div className="detailed-features-inner">
          
          {/* Feature Row 1: PDF Tools */}
          <div className="feature-row">
              <div className="feature-text">
                  <div className="feature-badge">PDF POWERHOUSE</div>
                  <h2>Complete PDF Mastery <br/> at Your Fingertips</h2>
                  <p>
                      Stop juggling multiple tools. Merge reports, split documents, compress large files, 
                      and stamp confidential watermarks—all within one intuitive interface.
                  </p>
                  <ul className="feature-list">
                      <li><i className="fas fa-check-circle"></i> Merge multiple PDFs into one</li>
                      <li><i className="fas fa-check-circle"></i> Split documents by page range</li>
                      <li><i className="fas fa-check-circle"></i> Smart compression algorithms</li>
                      <li><i className="fas fa-check-circle"></i> Custom text watermarking</li>
                  </ul>
                  <Link to="/register" className="btn-secondary">Try PDF Tools <i className="fas fa-arrow-right"></i></Link>
              </div>
              <div className="feature-visual">
                  <div className="visual-card-bg"></div>
                  <img src="/assets/feature_advanced_pdf.png" alt="PDF Tools" className="feature-hero-img" />
              </div>
          </div>

          {/* Feature Row 2: Image Studio (Reversed) */}
          <div className="feature-row reversed">
              <div className="feature-visual">
                  <div className="visual-card-bg alt-bg"></div>
                  <img src="/assets/feature_image_processor.png" alt="Image Processor" className="feature-hero-img" />
              </div>
              <div className="feature-text">
                  <div className="feature-badge">IMAGE STUDIO</div>
                  <h2>Professional Image <br/> Processing</h2>
                  <p>
                      Prepare your visual assets for any platform. Resize with precision, crop to perfect ratios, 
                      and convert between WebP, PNG, and JPEG instantly.
                  </p>
                  <ul className="feature-list">
                      <li><i className="fas fa-check-circle"></i> High-quality resizing</li>
                      <li><i className="fas fa-check-circle"></i> Precision cropping tool</li>
                      <li><i className="fas fa-check-circle"></i> Instant format conversion</li>
                      <li><i className="fas fa-check-circle"></i> Download as PDF</li>
                  </ul>
                  <Link to="/register" className="btn-secondary">Edit Images <i className="fas fa-arrow-right"></i></Link>
              </div>
          </div>

          {/* Feature Row 3: Security Suite */}
          <div className="feature-row">
              <div className="feature-text">
                  <div className="feature-badge">BANK-GRADE SECURITY</div>
                  <h2>The Vault: Your <br/> Private Digital Safe</h2>
                  <p>
                      Some documents need extra protection. Move sensitive files to your diverse Shield Vault, 
                      secure share links with expiration timers, and track access.
                  </p>
                  <ul className="feature-list">
                      <li><i className="fas fa-check-circle"></i> Secure Vault storage</li>
                      <li><i className="fas fa-check-circle"></i> Time-limited share links</li>
                      <li><i className="fas fa-check-circle"></i> Revoke access anytime</li>
                      <li><i className="fas fa-check-circle"></i> End-to-end encryption</li>
                  </ul>
                  <Link to="/register" className="btn-secondary">Secure Your Files <i className="fas fa-arrow-right"></i></Link>
              </div>
              <div className="feature-visual">
                  <div className="visual-card-bg"></div>
                  <img src="/assets/feature_security_suite.png" alt="Security Vault" className="feature-hero-img" />
              </div>
          </div>

          {/* Feature Row 4: Smart Workflow (Reversed) */}
          <div className="feature-row reversed">
              <div className="feature-visual">
                  <div className="visual-card-bg alt-bg"></div>
                  <img src="/assets/feature_smart_management.png" alt="Smart Workflow" className="feature-hero-img" />
              </div>
              <div className="feature-text">
                  <div className="feature-badge">SMART WORKFLOW</div>
                  <h2>Never Lose Track <br/> of a Version Again</h2>
                  <p>
                      Keep your workspace organized with version history, favorites, and pinning. 
                      Roll back to previous file versions with a single click.
                  </p>
                  <ul className="feature-list">
                      <li><i className="fas fa-check-circle"></i> Detailed version history</li>
                      <li><i className="fas fa-check-circle"></i> Pin important documents</li>
                      <li><i className="fas fa-check-circle"></i> One-click restore</li>
                      <li><i className="fas fa-check-circle"></i> Smart search & filters</li>
                  </ul>
                  <Link to="/register" className="btn-secondary">Start Organizing <i className="fas fa-arrow-right"></i></Link>
              </div>
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
                <button className="nav-link-btn" onClick={() => setShowDeveloper(true)}>About Developer</button>
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

        /* Scroll Progress */
        .scroll-progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: transparent;
            z-index: 2000;
        }
        .scroll-progress-bar {
            height: 100%;
            background: var(--brand-color);
            transition: width 0.1s ease-out;
            box-shadow: 0 0 10px var(--brand-color);
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
        .nav-about-btn {
            background: none; border: none; font-weight: 500; font-family: inherit;
            color: var(--text-dark); cursor: pointer; font-size: 0.95rem;
            margin-right: 8px; transition: color 0.2s;
        }
        .nav-about-btn:hover { color: var(--brand-color); }
        .nav-btn-login { color: var(--text-dark); font-weight: 500; text-decoration: none; }
        .nav-btn-primary { 
            background: var(--brand-color); color: white; padding: 10px 20px; 
            border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 0.95rem;
            transition: 0.2s;
            white-space: nowrap;
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

        /* Hero Visual - Realistic 3D */
        .hero-visual-side { 
            position: relative;
            transform-style: preserve-3d;
            perspective: 800px; /* Stronger perspective */
        }

        .ui-mockup-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 20px;
            /* Multi-layer realistic shadow */
            box-shadow: 
                0 40px 80px -20px rgba(0,0,0,0.2),
                0 10px 30px -10px rgba(0,0,0,0.1),
                0 0 0 1px rgba(255,255,255,0.6) inset;
            position: relative;
            transform: rotateX(var(--rotX, 0deg)) rotateY(var(--rotY, 0deg));
            transition: transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1);
            transform-style: preserve-3d;
        }

        /* Glare Effect */
        .ui-mockup-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 20px;
            background: radial-gradient(
                circle at var(--mx, 50%) var(--my, 50%), 
                rgba(255,255,255,0.6) 0%, 
                rgba(255,255,255,0) 60%
            );
            opacity: 0.6;
            z-index: 20;
            pointer-events: none;
            mix-blend-mode: overlay;
        }
        
        .mockup-img { 
            width: 100%; 
            border-radius: 12px; 
            opacity: 1;
            transform: translateZ(30px); /* Deeper */
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        /* Floating Cards Realistic */
        .float-card {
            position: absolute;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 14px;
            box-shadow: 
                0 25px 50px -12px rgba(0,0,0,0.25),
                0 0 0 1px rgba(255,255,255,0.5); /* Crisp border */
            padding: 12px;
            z-index: 30;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 180px;
            transform-style: preserve-3d;
            transform: translateZ(80px); /* Far out */
        }
        .float-card:hover {
             transform: translateZ(100px) scale(1.05);
             transition: all 0.3s ease;
        }

        /* 3D Background Shapes */
        .bg-3d-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
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
            top: -100px; right: -100px;
            animation-duration: 25s;
        }
        .shape-2 {
            width: 300px; height: 300px;
            background: #e0f2fe;
            bottom: 20%; left: -50px;
            animation-duration: 30s;
            animation-direction: reverse;
        }
        .shape-3 {
            width: 200px; height: 200px;
            background: #fee2e2;
            top: 40%; right: 20%;
            opacity: 0.3;
            animation-duration: 20s;
        }

        @keyframes floatShape {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -50px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
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
        .footer-links a, .footer-links button { margin-left: 24px; text-decoration: none; color: var(--text-gray); background: none; border: none; cursor: pointer; font-size: 0.95rem; font-family: inherit; }

        /* Responsive */
        @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr; margin-top: 100px; text-align: center; gap: 60px; }
            .hero-email-capture { margin: 0 auto 40px; }
            .brand-strip { justify-content: center; }
            .hero-desc { margin: 0 auto 32px; }
            .minimal-features-grid { grid-template-columns: 1fr; }
            .nav-links { display: none; }
            .card-visa { right: 0; } 
            .card-invoice { left: 0; }
            
            /* Disable heavy 3D on tablet/mobile for usability */
            .hero-visual-side { perspective: none; transform: none; }
            .ui-mockup-card { transform: none !important; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
            .mockup-img { transform: none; }
            .float-card { transform: none !important; position: absolute; z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        }

        @media (max-width: 600px) {
            .logo h1 { font-size: 1.1rem; }
            .nav-buttons { gap: 10px; }
            .nav-about-btn { display: none; } /* Hide text button on very small screens, keep in footer */
            .nav-btn-primary { padding: 8px 16px; font-size: 0.85rem; }
            
            .display-title { font-size: 2.5rem; }
            .hero-visual-side { padding: 0 10px; }
            .float-card { display: none; } /* Hide floating cards on mobile to prevent overflow/clutter */
            
            .detailed-features-inner { gap: 60px; padding-bottom: 60px; }
            .feature-row { gap: 30px; }
            .feature-text h2 { font-size: 2rem; }
            .feature-list { grid-template-columns: 1fr; }
        }

        .detailed-features-inner {
            display: flex;
            flex-direction: column;
            gap: 120px;
        }

        .feature-row {
            display: flex;
            align-items: center;
            gap: 80px;
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease-out;
        }

        .feature-row.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-row.reversed {
            flex-direction: row-reverse;
        }

        .feature-text {
            flex: 1;
        }

        .feature-badge {
            display: inline-block;
            background: rgba(13, 148, 136, 0.1);
            color: var(--brand-color);
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        .feature-text h2 {
            font-size: 2.8rem;
            line-height: 1.1;
            margin-bottom: 24px;
            color: var(--text-dark);
            letter-spacing: -1px;
        }

        .feature-text p {
            font-size: 1.1rem;
            color: var(--text-gray);
            line-height: 1.7;
            margin-bottom: 32px;
        }

        .feature-list {
            list-style: none;
            padding: 0;
            margin-bottom: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .feature-list li {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--text-dark);
            font-weight: 500;
        }

        .feature-list li i {
            color: var(--brand-color);
        }

        .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            color: var(--text-dark);
            font-weight: 700;
            text-decoration: none;
            border-bottom: 2px solid var(--brand-color);
            padding-bottom: 4px;
            transition: all 0.2s;
        }

        .btn-secondary:hover {
            color: var(--brand-color);
            gap: 15px;
        }

        .feature-visual {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .visual-card-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
            border-radius: 40px;
            transform: rotate(-3deg);
            z-index: 0;
            opacity: 0.6;
            transition: transform 0.3s ease;
        }

        .visual-card-bg.alt-bg {
            background: linear-gradient(135deg, #ccfbf1 0%, #ecfdf5 100%);
            transform: rotate(3deg);
        }

        .feature-row:hover .visual-card-bg {
            transform: rotate(-1deg) scale(1.02);
        }
        .feature-row:hover .visual-card-bg.alt-bg {
             transform: rotate(1deg) scale(1.02);
        }

        .feature-hero-img {
            position: relative;
            z-index: 1;
            width: 85%;
            max-width: 500px;
            filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
            transition: transform 0.3s ease;
        }

        .feature-row:hover .feature-hero-img {
            transform: translateY(-10px);
        }

        @media (max-width: 900px) {
            .detailed-features-inner { gap: 80px; }
            .feature-row, .feature-row.reversed {
                flex-direction: column;
                gap: 40px;
                text-align: center;
            }
            .feature-list {
                grid-template-columns: 1fr;
                justify-items: center; /* Center list items for centered text layout */
            }
            .feature-text h2 { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
}
