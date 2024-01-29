import { createTransport } from "nodemailer";

export const sendEmail = async (to, text, subject) => {
  const transporter = createTransport({
    host: smtp.gmail.com,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: {
        name: "Wall Clock Zone",
        address: process.env.SMTP_USER, // sender address
      },
      to,
      subject,
      text,
    });
    console.log(info);
  } catch (error) {
    console.log("can't send mail ", error);
  }
};
