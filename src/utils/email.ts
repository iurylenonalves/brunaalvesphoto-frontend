import nodemailer from "nodemailer";
import { SMTPConfig } from "./smtp";

export async function sendEmailWithTimeout(
  { name, email, message, smtpConfig }: {
    name: string;
    email: string;
    message: string;
    smtpConfig: SMTPConfig;
  },
  timeout = 10000
) {
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  return Promise.race([
    transporter.sendMail({
      from: `"${name}" <${smtpConfig.user}>`,
      to: smtpConfig.user,
      replyTo: email,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timed out")), timeout)
    ),
  ]);
}