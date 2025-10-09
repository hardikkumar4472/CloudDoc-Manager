import dotenv from "dotenv";
import fs from "fs";
import brevo from "sib-api-v3-sdk";

dotenv.config();

const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    // Convert attachments to base64 if provided
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

    const htmlAttachments = attachments
      ? attachments
          .map(
            (att) =>
              `<p>Attachment: <strong>${att.filename}</strong></p>`
          )
          .join("")
      : "";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>${subject}</h2>
        <p>${text}</p>
        ${htmlAttachments}
      </div>
    `;

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: "CloudDoc Saver",
      email: process.env.FROM_EMAIL || "no-reply@hardikproject.com",
    };
    sendSmtpEmail.to = Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }];
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.attachment = formattedAttachments;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Brevo email sent:", response);
    return { success: true, response };
  } catch (err) {
    console.error("❌ Brevo email error:", err);
    return { success: false, error: err.message };
  }
};
