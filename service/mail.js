require("dotenv").config();
const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_PORT, SECURE } = process.env;
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: SMTP_PORT || 587,
  secure: SECURE || false,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

exports.sendEmail = (object) => {
  const mailData = {
    from: `"Fastbeetech" <${SMTP_EMAIL}>`, // sender address
    to: object.email, // recipient address// list of receivers
    subject: object.subject,
    html: `${object.body}`,
  };

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.log({ message: "message not sent", error: err.message });
    } else {
      console.log({ message: "Email sent to ", messageID: info.messageId });
    }
  });
};
