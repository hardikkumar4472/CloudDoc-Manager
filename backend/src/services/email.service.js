import dotenv from "dotenv";
import brevo from "@getbrevo/brevo-api";

dotenv.config();

// Initialize Brevo API client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

export const sendOTP = async (email, otp) => {
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1 style="color:#4a86e8;">CloudDocManager Verification</h1>
    <p>Hello,</p>
    <p>You requested a one-time password for your CloudDocManager account:</p>
    <div style="text-align:center; margin:20px 0;">
      <span style="font-size:32px; font-weight:bold; letter-spacing:8px; background:#f0f6ff; padding:15px; border-radius:8px; border:2px dashed #4a86e8;">
        ${otp}
      </span>
    </div>
    <p>This code will expire in <strong>5 minutes</strong>.</p>
    <p>If you didn't request this, ignore this email.</p>
    <p>Need help? Contact <a href="mailto:civicconnectpvt@gmail.com">civicconnectpvt@gmail.com</a></p>
    <footer style="margin-top:30px; font-size:12px; color:#888;">&copy; ${new Date().getFullYear()} CloudDocManager</footer>
  </div>
  `;

  const textContent = `Your CloudDocManager OTP is: ${otp}. It will expire in 5 minutes.`;

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      email: process.env.FROM_EMAIL || "no-reply@hardikproject.com",
      name: "CloudDocManager",
    };
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.subject = "Your CloudDocManager Verification Code";
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = textContent;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("📤 Brevo OTP sent:", response);

    return { success: true, message: "OTP sent successfully", response };
  } catch (error) {
    console.error("❌ Brevo OTP error:", error);
    throw new Error("Failed to send OTP email");
  }
};
