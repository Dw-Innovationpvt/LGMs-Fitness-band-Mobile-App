import nodemailer from 'nodemailer';
// import "dotenv/config";
// import dotenv from 'dotenv';

// dotenv.config(); // MUST BE HERE

// const SMTP_USER="8e066c001@smtp-brevo.com"
// const SMTP_PASSWORD="akS8m5j9WtTdHbVQ"
// const SENDER_EMAIL="madanpiske1729@gmail.com"

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
	port: 587,
	secure: false,
    // service: 'gmail', // or another email service
    auth: {
        // user: SMTP_USER, // your email address
        user: process.env.SMTP_USER, // your email address
        // pass: SMTP_PASSWORD  // your email password or app password
        pass: process.env.SMTP_PASSWORD  // your email password or app password
    }
});

// console.log('SMTP_USER:', process.env.SMTP_USER);
// Wrap in an async IIFE so we can use await.
// (async () => {
//     console.log("Sending email...");
//   const info = await transporter.sendMail({
//     from: '"Unemployed Organization" <madanpiske1729@gmail.com>',
//     to: "olahubc143@gmail.com",
//     subject: "Verify OTP ✔",
//     text: "Hello world?", // plain‑text body
//     html: `<div style="font-family: sans-serif; line-height: 1.6;">
//                     <p>Hello,</p>
//                     <p>Thank you for using our Fitness App!</p>
//                     <p>Your One-Time Password (OTP) for verification is:</p>
//                     <h2 style="color: pink; font-size: 24px; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
//                         143
//                     </h2>
//                     <p>Please use this OTP to complete your login or registration. This OTP is valid for **5 minutes**.</p>
//                     <p>If you did not request this, please ignore this email.</p>
//                     <br>
//                     <p>Regards,</p>
//                     <p>The Fitness App Team</p>
//                 </div>`, // HTML body
//   });

//   console.log("Message sent:", info.messageId);
// })();
// this upside code is for testing purpose and working fine

// async function sendMail({ to, subject, text, html }) {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         text,
//         html
//     };

//     return transporter.sendMail(mailOptions);
// }

export default transporter;