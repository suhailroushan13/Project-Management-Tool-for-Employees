import nodemailer from "nodemailer";
import config from "config";

// Updated function signature to accept emailBody
async function sendEmail(emailBody, subject, recipients) {
  try {
    // Create a Nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.get("USER"),
        pass: config.get("PASS"),
      },
    });

    // Iterate through recipients and send emails
    for (const recipient of recipients) {
      // Dynamic replacement of variables in the email body
      let personalizedEmailBody = emailBody;
      for (const key in recipient) {
        personalizedEmailBody = personalizedEmailBody.replace(
          new RegExp(`\\$\{${key}\}`, "g"),
          recipient[key]
        );
      }

      // Email options
      const mailOptions = {
        from: `Project Management Tool T-Works <mailer@tworks.in>`,
        to: recipient.email,
        subject: subject,
        html: personalizedEmailBody,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(
        `Email sent to ${recipient.fullName} (${recipient.email}) successfully!`
      );
    }

    console.log("All emails sent successfully!");
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

export default sendEmail;
