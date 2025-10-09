// import nodemailer from "nodemailer";

// export const sendMail = async ({ to, subject, text, attachments }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", // or smtp config
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });
//     const mailOptions = {
//       from: `"CloudDoc Saver" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       text,
//       attachments, 
//     };
//     await transporter.sendMail(mailOptions);
//     return { success: true };
//   } catch (err) {
//     console.error("Email sending error:", err);
//     return { success: false, error: err.message };
//   }
// };

import dotenv from "dotenv";
import Brevo from "brevo";

dotenv.config();

// Initialize Brevo client
const brevo = new Brevo.TransactionalEmailsApi();
brevo.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;


export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    // Convert attachments if provided
    const formattedAttachments = attachments
      ? attachments.map((file) => ({
          name: file.filename,
          url: file.path,
        }))
      : [];

    const htmlAttachments = attachments
      ? attachments
          .map(
            (att) =>
              `<p>Attachment: <a href="${att.path}">${att.filename}</a></p>`
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
