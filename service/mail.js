require("dotenv").config();
const nodemailer = require('nodemailer')
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
    port: 587,     
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
        },
    });

exports.sendEmail =  (object) => {
    const mailData = {
        from: `"Fastbeetech" <harbiola78@gmail.com>`,  // sender address
        to: object.email, // recipient address// list of receivers
        subject: object.subject,
        body: object.body,
    };

    transporter.sendMail(mailData, function(err, info) {
        if(err) return console.log({message: 'message not sent', error:  err.message})
        else return console.log({message:"Email sent to ", messageID: info.messageId})
     })
    }
