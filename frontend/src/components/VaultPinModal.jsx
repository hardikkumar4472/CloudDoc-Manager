import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useToast } from "../context/ToastContext";

export default function VaultPinModal({ isOpen, onClose, onSuccess, mode = "verify" }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen) {
        setPin(["", "", "", ""]);
    }
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto focus next input
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pinString = pin.join("");
    if (pinString.length !== 4) return;

    setLoading(true);
    try {
      if (mode === "set") {
          await axios.post(`${API_URL}/api/auth/vault/set-pin`, { pin: pinString }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          addToast("Vault PIN set successfully", "success");
          onSuccess();
          onClose();
      } else {
          await axios.post(`${API_URL}/api/auth/vault/verify-pin`, { pin: pinString }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          onSuccess();
          onClose();
      }
    } catch (error) {
       addToast(error.response?.data?.msg || "Incorrect PIN", "error");
       setPin(["", "", "", ""]);
       document.getElementById("pin-0").focus();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="pin-modal">
        <button className="close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="pin-content">
            <div className="icon-lock">
                <i className="fas fa-lock"></i>
            </div>
            <h3>{mode === "set" ? "Set Vault PIN" : "Enter Vault PIN"}</h3>
            <p className="sub-text">
                {mode === "set" 
                 ? "Create a 4-digit PIN to secure your vault files." 
                 : "Please enter your PIN to access the vault."}
            </p>

            <form onSubmit={handleSubmit}>
                <div className="pin-inputs">
                    {pin.map((digit, i) => (
                        <input
                            key={i}
                            id={`pin-${i}`}
                            type="password"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="pin-digit"
                            autoFocus={i === 0}
                        />
                    ))}
                </div>
                
                <button type="submit" className="btn-verify" disabled={loading || pin.join("").length !== 4}>
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === "set" ? "Set PIN" : "Access Vault")}
                </button>
            </form>
        </div>
      </div>

      <style>{`
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .pin-modal {
            background: rgba(255, 255, 255, 0.95);
            width: 90%;
            max-width: 400px;
            padding: 2rem 2rem;
            border-radius: 24px;
            box-shadow: 0 40px 80px -20px rgba(0,0,0,0.3);
            text-align: center;
            position: relative;
            animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: transparent;
            border: none;
            font-size: 1.2rem;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .icon-lock {
            width: 60px;
            height: 60px;
            background: rgba(13, 148, 136, 0.1);
            color: var(--brand-color);
            border-radius: 50%;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
        }

        .pin-modal h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }

        .sub-text {
            color: var(--text-secondary);
            font-size: 0.9rem;
            margin-bottom: 2rem;
        }

        .pin-inputs {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 2rem;
        }

        .pin-digit {
            width: 50px;
            height: 60px;
            font-size: 24px;
            text-align: center;
            border: 2px solid var(--border-color);
            background: var(--input-bg);
            border-radius: 12px;
            outline: none;
            transition: all 0.2s;
            color: var(--text-primary);
        }

        .pin-digit:focus {
            border-color: var(--brand-color);
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(13, 148, 136, 0.15);
        }

        .btn-verify {
            width: 100%;
            padding: 14px;
            background: var(--brand-color);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-verify:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .btn-verify:not(:disabled):hover {
            filter: brightness(1.1);
            transform: translateY(-2px);
        }

        @keyframes popIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
