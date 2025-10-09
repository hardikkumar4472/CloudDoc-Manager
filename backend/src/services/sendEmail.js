// sendMail.js
import dotenv from "dotenv";
import fs from "fs";
import Brevo from "@brevo/node";

dotenv.config();

const brevo = new Brevo.TransactionalEmailsApi();
brevo.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

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

    const emailData = {
      sender: {
        name: "CloudDoc Saver",
        email: process.env.FROM_EMAIL,
      },
      to: Array.isArray(to)
        ? to.map((email) => ({ email }))
        : [{ email: to }],
      subject,
      htmlContent,
      textContent: text,
      attachment: formattedAttachments,
    };

    const response = await brevo.sendTransacEmail(emailData);

    console.log("✅ Brevo email sent:", response);
    return { success: true, response };
  } catch (err) {
    console.error("❌ Brevo email error:", err);
    return { success: false, error: err.message };
  }
};
