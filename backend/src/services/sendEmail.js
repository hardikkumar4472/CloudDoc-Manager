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

import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    const htmlAttachments = attachments
      ? attachments.map(
          (att) =>
            `<p>Attachment: <a href="${att.path}">${att.filename}</a></p>`
        ).join("")
      : "";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>${subject}</h2>
        <p>${text}</p>
        ${htmlAttachments}
      </div>
    `;

    const response = await resend.emails.send({
      from: `"CloudDoc Saver" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html: htmlContent,
    });

    return { success: true, response };
  } catch (err) {
    console.error("Resend email error:", err);
    return { success: false, error: err.message };
  }
};
