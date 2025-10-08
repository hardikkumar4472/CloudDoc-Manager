// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// dotenv.config();

// console.log("SMTP_USER:", process.env.SMTP_USER);
// console.log("SMTP_PASS exists?", !!process.env.SMTP_PASS);

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT), 
//   secure: false, 
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendOTP = async (email, otp) => {
//   await transporter.sendMail({
//     from: process.env.FROM_EMAIL,
//     to: email,
//     subject: "Your CloudDocSaver OTP Code",
//     text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
//   });
// };


// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// dotenv.config();

// console.log("SMTP_USER:", process.env.SMTP_USER);
// console.log("SMTP_PASS exists?", !!process.env.SMTP_PASS);

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT), 
//   secure: false, 
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendOTP = async (email, otp) => {
//   const htmlContent = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>OTP Email</title>
//       <style>
//           body {
//               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//               line-height: 1.6;
//               color: #333333;
//               margin: 0;
//               padding: 0;
//               background-color: #f7f7f7;
//           }
//           .email-container {
//               max-width: 600px;
//               margin: 0 auto;
//               background-color: #ffffff;
//           }
//           .email-header {
//               background: linear-gradient(135deg, #4a86e8 0%, #3a75d9 100%);
//               padding: 25px;
//               text-align: center;
//               border-radius: 5px 5px 0 0;
//           }
//           .email-header h1 {
//               color: #ffffff;
//               margin: 0;
//               font-size: 24px;
//               font-weight: 600;
//           }
//           .email-body {
//               padding: 30px;
//           }
//           .otp-container {
//               text-align: center;
//               margin: 25px 0;
//           }
//           .otp-code {
//               display: inline-block;
//               font-size: 32px;
//               font-weight: bold;
//               letter-spacing: 8px;
//               color: #4a86e8;
//               background-color: #f0f6ff;
//               padding: 15px 25px;
//               border-radius: 8px;
//               border: 2px dashed #4a86e8;
//               margin: 15px 0;
//           }
//           .message {
//               font-size: 16px;
//               margin-bottom: 20px;
//               color: #555555;
//           }
//           .note {
//               background-color: #fff9e6;
//               border-left: 4px solid #ffc107;
//               padding: 15px;
//               margin: 20px 0;
//               font-size: 14px;
//               border-radius: 4px;
//           }
//           .footer {
//               text-align: center;
//               padding: 20px;
//               font-size: 14px;
//               color: #888888;
//               border-top: 1px solid #eeeeee;
//               margin-top: 30px;
//           }
//           .button {
//               display: inline-block;
//               background-color: #4a86e8;
//               color: white;
//               padding: 12px 24px;
//               text-decoration: none;
//               border-radius: 5px;
//               margin: 15px 0;
//               font-weight: 600;
//           }
//           .support-link {
//               color: #4a86e8;
//               text-decoration: none;
//           }
//           @media (max-width: 600px) {
//               .email-body {
//                   padding: 20px;
//               }
//               .otp-code {
//                   font-size: 24px;
//                   letter-spacing: 5px;
//                   padding: 12px 20px;
//               }
//           }
//       </style>
//   </head>
//   <body>
//       <div class="email-container">
//           <div class="email-header">
//               <h1>CloudDocManager Verification</h1>
//           </div>
//           <div class="email-body">
//               <p class="message">Hello,</p>
//               <p class="message">You requested a one-time password for your CloudDocManager account. Use the following verification code to complete your action:</p>
              
//               <div class="otp-container">
//                   <div class="otp-code">${otp}</div>
//               </div>
              
//               <p class="message">This code will expire in <strong>5 minutes</strong> for security reasons.</p>
              
//               <div class="note">
//                   <strong>Security Note:</strong> If you didn't request this code, please ignore this email or contact our support team immediately.
//               </div>
              
//               <p class="message">Need help? Contact our support team at <a href="mailto:civicconnectpvt@gmail.com" class="support-link">civicconnectpvt@gmail.com</a></p>
//           </div>
//           <div class="footer">
//               <p>&copy; ${new Date().getFullYear()} CloudDocManager. All rights reserved.</p>
//           </div>
//       </div>
//   </body>
//   </html>
//   `;

//   const textContent = `
//   CloudDocManager Verification
  
//   You requested a one-time password for your CloudDocManager account.
  
//   Your OTP code is: ${otp}
  
//   This code will expire in 5 minutes for security reasons.
  
//   Security Note: If you didn't request this code, please ignore this email or contact our support team immediately.
  
//   Need help? Contact our support team at civicconnectpvt@gmail.com
//   `;

//   await transporter.sendMail({
//     from: process.env.FROM_EMAIL,
//     to: email,
//     subject: "Your CloudDocManager Verification Code",
//     text: textContent,
//     html: htmlContent
//   });
// };


import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp) => {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Email</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #f7f7f7;
          }
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
          }
          .email-header {
              background: linear-gradient(135deg, #4a86e8 0%, #3a75d9 100%);
              padding: 25px;
              text-align: center;
              border-radius: 5px 5px 0 0;
          }
          .email-header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              font-weight: 600;
          }
          .email-body {
              padding: 30px;
          }
          .otp-container {
              text-align: center;
              margin: 25px 0;
          }
          .otp-code {
              display: inline-block;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #4a86e8;
              background-color: #f0f6ff;
              padding: 15px 25px;
              border-radius: 8px;
              border: 2px dashed #4a86e8;
              margin: 15px 0;
          }
          .message {
              font-size: 16px;
              margin-bottom: 20px;
              color: #555555;
          }
          .note {
              background-color: #fff9e6;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
              border-radius: 4px;
          }
          .footer {
              text-align: center;
              padding: 20px;
              font-size: 14px;
              color: #888888;
              border-top: 1px solid #eeeeee;
              margin-top: 30px;
          }
          .button {
              display: inline-block;
              background-color: #4a86e8;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 15px 0;
              font-weight: 600;
          }
          .support-link {
              color: #4a86e8;
              text-decoration: none;
          }
          @media (max-width: 600px) {
              .email-body {
                  padding: 20px;
              }
              .otp-code {
                  font-size: 24px;
                  letter-spacing: 5px;
                  padding: 12px 20px;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <h1>CloudDocManager Verification</h1>
          </div>
          <div class="email-body">
              <p class="message">Hello,</p>
              <p class="message">You requested a one-time password for your CloudDocManager account. Use the following verification code to complete your action:</p>
              
              <div class="otp-container">
                  <div class="otp-code">${otp}</div>
              </div>
              
              <p class="message">This code will expire in <strong>5 minutes</strong> for security reasons.</p>
              
              <div class="note">
                  <strong>Security Note:</strong> If you didn't request this code, please ignore this email or contact our support team immediately.
              </div>
              
              <p class="message">Need help? Contact our support team at <a href="mailto:civicconnectpvt@gmail.com" class="support-link">civicconnectpvt@gmail.com</a></p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} CloudDocManager. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;

  const textContent = `
  CloudDocManager Verification
  
  You requested a one-time password for your CloudDocManager account.
  
  Your OTP code is: ${otp}
  
  This code will expire in 5 minutes for security reasons.
  
  Security Note: If you didn't request this code, please ignore this email or contact our support team immediately.
  
  Need help? Contact our support team at civicconnectpvt@gmail.com
  `;

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Your CloudDocManager Verification Code",
      html: htmlContent,
      text: textContent,
    });

    return { success: true, message: "OTP resent successfully", response };
  } catch (error) {
    console.error("Resend OTP Error:", error);
    throw new Error("Failed to send OTP email");
  }
};
