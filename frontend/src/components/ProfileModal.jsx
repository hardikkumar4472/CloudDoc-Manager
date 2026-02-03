import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function ProfileModal({ user, onClose, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("details"); // details, security
  const [name, setName] = useState(user.name);
  const [editingName, setEditingName] = useState(false);
  
  // Email Change States
  const [emailStep, setEmailStep] = useState(0); // 0: View, 1: Input New, 2: OTP
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");

  // Password Change States
  const [passStep, setPassStep] = useState(0); // 0: Init, 1: Verify Old, 2: OTP & New Pass
  const [oldPassword, setOldPassword] = useState("");
  const [passOtp, setPassOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 2FA States
  const [show2faSetup, setShow2faSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorOtp, setTwoFactorOtp] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(user.isTwoFactorEnabled);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      await axios.patch(`${API_URL}/api/auth/update-name`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingName(false);
      onUpdateUser(); // Refresh user data
      setMessage("Name updated successfully");
    } catch (error) {
      setMessage("Failed to update name");
    }
    setLoading(false);
  };

  const handleRequestEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_URL}/api/auth/request-email-change`, { newEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmailStep(2);
      setMessage(`OTP sent to ${newEmail}`);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to request email change");
    }
    setLoading(false);
  };

  const handleVerifyEmailChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-email-change`, { otp: emailOtp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmailStep(0);
      setNewEmail("");
      setEmailOtp("");
      onUpdateUser();
      setMessage("Email updated successfully");
    } catch (error) {
       console.log(error);
      setMessage(error.response?.data?.msg || "Failed to verify email change");
    }
    setLoading(false);
  };

  const handleRequestPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API_URL}/api/auth/request-password-change`, { oldPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassStep(2);
      setMessage("OTP sent to your email");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Incorrect password");
    }
    setLoading(false);
  };

  const handleVerifyPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-password-change`, { 
        otp: passOtp, 
        newPassword 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPassStep(0);
      setOldPassword("");
      setPassOtp("");
      setNewPassword("");
      setMessage("Password updated successfully");
    } catch (error) {
      setMessage(error.response?.data?.msg || "Failed to update password");
    }
    setLoading(false);
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
        const res = await axios.post(`${API_URL}/api/auth/2fa/enable`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setQrCodeUrl(res.data.qrCodeUrl);
        setShow2faSetup(true);
    } catch (error) {
        setMessage("Failed to initialize 2FA");
    }
    setLoading(false);
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await axios.post(`${API_URL}/api/auth/2fa/verify`, { token: twoFactorOtp }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setIs2faEnabled(true);
        setShow2faSetup(false);
        onUpdateUser();
        setMessage("2FA Enabled successfully!");
    } catch (error) {
        setMessage("Invalid 2FA code");
    }
    setLoading(false);
  };

  const handleDisable2FA = async () => {
    if (!window.confirm("Are you sure? This reduces account security.")) return;
    setLoading(true);
    try {
        await axios.post(`${API_URL}/api/auth/2fa/disable`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setIs2faEnabled(false);
        onUpdateUser();
        setMessage("2FA Disabled");
    } catch (error) {
        setMessage("Failed to disable 2FA");
    }
    setLoading(false);
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="profile-modal-premium">
        <button className="close-btn-v2" onClick={onClose} aria-label="Close modal">
            <i className="fas fa-times"></i>
        </button>

        <div className="profile-hero">
            <div className="avatar-large">
                {user.name?.charAt(0).toUpperCase() || <i className="fas fa-user"></i>}
            </div>
            <div className="hero-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
            </div>
        </div>

        <div className="modal-content-glass">
            <div className="profile-tabs-v2">
                <button 
                  className={activeTab === 'details' ? 'active' : ''} 
                  onClick={() => setActiveTab('details')}
                >
                    Details
                </button>
                <button 
                  className={activeTab === 'security' ? 'active' : ''} 
                  onClick={() => setActiveTab('security')}
                >
                    Security
                </button>
            </div>

            <div className="tab-pane">
                {message && (
                    <div className={`status-msg ${message.includes("Failed") || message.includes("Incorrect") || message.includes("Invalid") ? 'error' : 'success'}`}>
                        <i className={`fas ${message.includes("Failed") || message.includes("Incorrect") || message.includes("Invalid") ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i>
                        {message}
                    </div>
                )}
                
                {activeTab === 'details' && (
                    <div className="content-stack">
                        <div className="premium-field">
                            <div className="field-label-group">
                                <label>Full Name</label>
                                {!editingName && <button className="inline-edit" onClick={() => setEditingName(true)}>Change</button>}
                            </div>
                            
                            {editingName ? (
                                <div className="inline-editor">
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="premium-field-input"
                                        autoFocus
                                    />
                                    <div className="editor-controls">
                                        <button className="confirm-btn" onClick={handleUpdateName} disabled={loading}>
                                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                                        </button>
                                        <button className="cancel-btn" onClick={() => { setEditingName(false); setName(user.name); }}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="field-display">{user.name}</div>
                            )}
                        </div>

                        <div className="premium-field">
                            <div className="field-label-group">
                                <label>Email Address</label>
                                {emailStep === 0 && <button className="inline-edit" onClick={() => setEmailStep(1)}>Update</button>}
                            </div>
                            
                            {emailStep === 0 && <div className="field-display">{user.email}</div>}

                            {emailStep === 1 && (
                                <form onSubmit={handleRequestEmailChange} className="inline-form-stack">
                                    <input 
                                        type="email" 
                                        placeholder="New email address"
                                        value={newEmail} 
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="premium-field-input"
                                        required
                                    />
                                    <div className="form-actions">
                                        <button type="submit" className="action-btn-main" disabled={loading}>
                                            {loading ? "Sending..." : "Send OTP"}
                                        </button>
                                        <button type="button" className="action-btn-ghost" onClick={() => setEmailStep(0)}>Cancel</button>
                                    </div>
                                </form>
                            )}

                            {emailStep === 2 && (
                                <form onSubmit={handleVerifyEmailChange} className="inline-form-stack">
                                    <div className="otp-helper">Verifying <b>{newEmail}</b></div>
                                    <input 
                                        type="text" 
                                        placeholder="6-digit OTP"
                                        value={emailOtp} 
                                        onChange={(e) => setEmailOtp(e.target.value)}
                                        className="premium-field-input otp-field"
                                        required
                                    />
                                    <div className="form-actions">
                                        <button type="submit" className="action-btn-main" disabled={loading}>
                                            {loading ? "Verifying..." : "Confirm Update"}
                                        </button>
                                        <button type="button" className="action-btn-ghost" onClick={() => setEmailStep(0)}>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="content-stack">
                        <div className="premium-field">
                            <label>Passcode & Security</label>
                            
                            {passStep === 0 && (
                                <form onSubmit={handleRequestPasswordChange} className="inline-form-stack">
                                    <p className="hint-text">To update your password, first verify your current identity.</p>
                                    <input 
                                        type="password" 
                                        placeholder="Current Password"
                                        value={oldPassword} 
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="premium-field-input"
                                        required
                                    />
                                    <button type="submit" className="action-btn-main" disabled={loading}>
                                        {loading ? "Verifying..." : "Verify Identity"}
                                    </button>
                                </form>
                            )}

                            {passStep === 2 && (
                                <form onSubmit={handleVerifyPasswordChange} className="inline-form-stack">
                                    <div className="otp-helper">OTP sent to <b>{user.email}</b></div>
                                    <input 
                                        type="text" 
                                        placeholder="OTP"
                                        value={passOtp} 
                                        onChange={(e) => setPassOtp(e.target.value)}
                                        className="premium-field-input otp-field"
                                        required
                                    />
                                    <input 
                                        type="password" 
                                        placeholder="New Password (min 6 chars)"
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="premium-field-input"
                                        required
                                    />
                                    <div className="form-actions">
                                        <button type="submit" className="action-btn-main" disabled={loading}>
                                            {loading ? "Updating..." : "Secure Account"}
                                        </button>
                                        <button type="button" className="action-btn-ghost" onClick={() => { setPassStep(0); setOldPassword(""); }}>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="premium-field">
                            <div className="field-label-group">
                                <label>Two-Factor Authentication</label>
                                <span className={`status-pill ${is2faEnabled ? 'active' : ''}`}>
                                    {is2faEnabled ? 'Protected' : 'Unsecured'}
                                </span>
                            </div>

                            {is2faEnabled ? (
                                <div className="action-row">
                                    <p className="hint-text">2FA is currently active on your account.</p>
                                    <button className="action-btn-ghost btn-sm" onClick={handleDisable2FA} disabled={loading}>
                                        Disable 2FA
                                    </button>
                                </div>
                            ) : (
                                !show2faSetup ? (
                                    <div className="action-row">
                                        <p className="hint-text">Add an extra layer of security to your account.</p>
                                        <button className="action-btn-main btn-sm" onClick={handleEnable2FA} disabled={loading}>
                                            Setup 2FA
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleVerify2FA} className="inline-form-stack setup-2fa-box">
                                        <p className="hint-text">Scan this QR code with your Authenticator app (Google, Authy, etc.)</p>
                                        <div className="qr-container">
                                            {qrCodeUrl && <img src={qrCodeUrl} alt="2FA QR Code" />}
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit code"
                                            value={twoFactorOtp} 
                                            onChange={(e) => setTwoFactorOtp(e.target.value)}
                                            className="premium-field-input otp-field"
                                            required
                                        />
                                        <div className="form-actions">
                                            <button type="submit" className="action-btn-main" disabled={loading}>
                                                Verify & Enable
                                            </button>
                                            <button type="button" className="action-btn-ghost" onClick={() => setShow2faSetup(false)}>Cancel</button>
                                        </div>
                                    </form>
                                )
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
            position: fixed; inset: 0; 
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(12px);
            z-index: 9999; display: flex; align-items: center; justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .profile-modal-premium {
            background: var(--card-bg);
            width: 95%; max-width: 440px; border-radius: 32px;
            overflow: hidden; border: 1px solid var(--border-color);
            box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
            animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
        }

        .close-btn-v2 {
            position: absolute; top: 20px; right: 20px;
            width: 36px; height: 36px; border-radius: 50%;
            background: rgba(255,255,255,0.05); border: none;
            color: var(--text-secondary); cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            z-index: 10; transition: all 0.2s;
        }
        .close-btn-v2:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .profile-hero {
            padding: 40px 30px 30px;
            background: linear-gradient(to bottom, rgba(var(--accent-rgb, 59, 130, 246), 0.1), transparent);
            text-align: center;
            border-bottom: 1px solid var(--border-color);
        }

        .avatar-large {
            width: 80px; height: 80px; border-radius: 28px;
            background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
            margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
            font-size: 32px; font-weight: 800; color: white;
            box-shadow: 0 10px 25px var(--accent-glow);
        }

        .hero-info h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 4px; color: var(--text-primary); }
        .hero-info p { font-size: 0.9rem; color: var(--text-secondary); }

        .modal-content-glass { padding: 24px 30px 40px; }

        .profile-tabs-v2 {
            display: flex; gap: 8px; background: var(--input-bg);
            padding: 6px; border-radius: 18px; margin-bottom: 24px;
        }

        .profile-tabs-v2 button {
            flex: 1; padding: 12px; border: none; border-radius: 14px;
            font-weight: 700; color: var(--text-secondary); cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 0.9rem;
        }

        .profile-tabs-v2 button.active {
            background: var(--card-bg); color: var(--accent-color);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .status-msg {
            padding: 12px 16px; border-radius: 16px; margin-bottom: 20px;
            display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600;
        }
        .status-msg.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-msg.error { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .content-stack { display: flex; flex-direction: column; gap: 24px; }

        .premium-field label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        
        .field-label-group { display: flex; justify-content: space-between; align-items: flex-end; }
        .inline-edit { font-size: 0.8rem; font-weight: 700; color: var(--accent-color); background: none; border: none; cursor: pointer; padding: 0 0 8px; }
        .inline-edit:hover { text-decoration: underline; }

        .field-display { font-size: 1.05rem; font-weight: 600; color: var(--text-primary); }

        .inline-editor { display: flex; gap: 8px; }
        .premium-field-input {
            flex: 1; padding: 12px 16px; border-radius: 14px;
            background: var(--input-bg); border: 2px solid var(--border-color);
            color: var(--text-primary); font-size: 0.95rem; outline: none; transition: 0.2s;
        }
        .premium-field-input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 4px var(--accent-glow); }

        .editor-controls { display: flex; gap: 6px; }
        .confirm-btn, .cancel-btn {
            width: 46px; border-radius: 14px; border: none; cursor: pointer; transition: 0.2s;
        }
        .confirm-btn { background: var(--accent-color); color: white; }
        .cancel-btn { background: var(--input-bg); color: var(--text-secondary); border: 1px solid var(--border-color); }

        .inline-form-stack { display: flex; flex-direction: column; gap: 12px; }
        .hint-text { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 4px; }
        
        .form-actions { display: flex; gap: 10px; }
        .action-btn-main {
            flex: 2; padding: 14px; border-radius: 16px; background: var(--accent-color);
            color: white; border: none; font-weight: 700; cursor: pointer; transition: 0.2s;
        }
        .action-btn-ghost {
            flex: 1; padding: 14px; border-radius: 16px; background: transparent;
            color: var(--text-secondary); border: 1px solid var(--border-color); font-weight: 600; cursor: pointer;
        }

        .otp-helper { font-size: 0.8rem; color: var(--text-secondary); margin-bottom: -4px; }
        .otp-field { font-family: monospace; font-size: 1.2rem; letter-spacing: 0.2em; text-align: center; font-weight: 800; }

        .status-pill {
            font-size: 0.65rem; padding: 2px 8px; border-radius: 8px;
            background: rgba(239, 68, 68, 0.1); color: #ef4444; font-weight: 800; text-transform: uppercase;
        }
        .status-pill.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }

        .btn-sm { padding: 10px 16px !important; font-size: 0.85rem !important; }

        .action-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 8px; }

        .setup-2fa-box { background: var(--input-bg); padding: 16px; border-radius: 20px; border: 1px solid var(--border-color); }
        .qr-container { background: white; padding: 12px; border-radius: 12px; display: inline-block; margin: 10px auto; width: fit-content; }
        .qr-container img { width: 140px; height: 140px; display: block; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
            from { transform: translateY(30px) scale(0.95); opacity: 0; } 
            to { transform: translateY(0) scale(1); opacity: 1; } 
        }

        @media (max-width: 480px) {
            .profile-modal-premium { border-radius: 0; width: 100%; height: 100%; max-width: none; overflow-y: auto; }
            .modal-content-glass { padding: 30px 20px 40px; }
        }
      `}</style>
    </div>,
    document.body
  );
}
