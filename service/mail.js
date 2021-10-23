require("dotenv").config();
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    port: 587,     
    host: "smtp.gmail.com",
    secure: false,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
        },
    });

module.exports = (to, subject, body) => {

    const mailData = {
        from: `"Fastbeetech" <${SMTP_EMAIL}>`,  // sender address
        to: to, // recipient address// list of receivers
        subject: subject,
        html: body,
    };

    transporter.sendMail(mailData, function(err, info) {
        if(err) {
            console.log({message: 'message not sent', error:  err.message})
            console.log(err)
        }
        else {
            console.log({message:"Email sent to ", messageID: info.messageId})
        }
        
     })
    }
