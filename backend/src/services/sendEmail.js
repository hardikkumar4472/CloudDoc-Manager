import dotenv from "dotenv";
import brevo from 'sib-api-v3-sdk';
import fs from "fs";

dotenv.config();

// Initialize Brevo API client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    // Convert attachments to base64 for Brevo
    const formattedAttachments = attachments
      ? await Promise.all(
          attachments.map(async (file) => {
            const fileData = await fs.promises.readFile(file.path);
            return {
              name: file.filename,
              content: fileData.toString("base64"),
            };
          })
        )
      : [];

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "CloudDoc Saver",
      email: process.env.FROM_EMAIL,
    };
    sendSmtpEmail.to = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.attachment = formattedAttachments;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true };
  } catch (err) {
    console.error("Email sending error:", err);
    return { success: false, error: err.message };
  }
};
