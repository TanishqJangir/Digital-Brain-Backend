// import nodemailer from "nodemailer";
// import { env } from "../config/env";

// export const sendOtpEmail = async (email: string, otp: string) => {

//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     requireTLS: true,
//     logger: true,
//     debug: true,
//     auth: {
//       user: env.EMAIL_USER,
//       pass: env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Digital Brain" <${env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     html: `<h2>Your OTP is ${otp}</h2>`,
//   });
// };