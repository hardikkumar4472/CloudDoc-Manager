import dotenv from "dotenv";
import brevo from 'sib-api-v3-sdk';
import https from 'https';
import fs from "fs";

dotenv.config();

// Initialize Brevo API client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

// Function to download file from URL
const downloadFileFromUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    });
  });
};

export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    // Convert attachments to base64 for Brevo
    const formattedAttachments = attachments
      ? await Promise.all(
          attachments.map(async (file) => {
            let fileData;
            
            // Check if it's a URL (starts with http/https)
            if (file.path.startsWith('http')) {
              // Download from URL
              fileData = await downloadFileFromUrl(file.path);
            } else {
              // Read local file
              fileData = await fs.promises.readFile(file.path);
            }
            
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
