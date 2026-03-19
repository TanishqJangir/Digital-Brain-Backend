import nodemailer from "nodemailer";
import { env } from "../config/env";

export const sendOtpEmail = async (email: string, otp: string) => {

  console.log(env.BRAVO_PASS);
  console.log(env.BRAVO_USER);
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: env.BRAVO_USER,
      pass: env.BRAVO_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Digital Brain" <${env.BRAVO_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};