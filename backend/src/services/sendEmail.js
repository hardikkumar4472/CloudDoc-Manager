import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, text, attachments }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or smtp config
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: `"CloudDoc Saver" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      attachments, 
    };
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("Email sending error:", err);
    return { success: false, error: err.message };
  }
};
