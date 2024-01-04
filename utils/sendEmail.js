import { createTransport } from "nodemailer";

export const sendEmail = async (to, text, subject) => {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    // from: "myid@gmail.com", // sender address
    to,
    subject,
    text,
  });
};
