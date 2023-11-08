import nodemailer from "nodemailer";
import config from "config";

const HOST = config.get("EMAIL_SMTP.HOST");
const AUTH = config.get("EMAIL_SMTP.AUTH");
const PORT = config.get("EMAIL_SMTP.PORT");

let sendEMail = async (emailData) => {
  try {
    let transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: true,
      auth: {
        user: AUTH.USER,
        pass: AUTH.PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"From T-Works Foundation" <${AUTH["USER"]}>`,
      subject: emailData.subject,
      to: emailData.to,
      html: emailData.body,
    });

    console.log("Email sent");
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
};

sendEMail({
  subject: "Hello",
  to: "suhail@code.in",
  body: "Testting",
});
