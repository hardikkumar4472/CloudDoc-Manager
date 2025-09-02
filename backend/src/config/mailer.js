import nodemailer from "nodemailer";

console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists?", !!process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Your CloudDocSaver OTP Code",
    text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
  });
};
