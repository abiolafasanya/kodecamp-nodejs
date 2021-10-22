const {sendEmail} = require('../service/mail')
console.log(sendEmail)
exports.testMail = (req, res) => {
    let {name, email, message} = req.body
    let data = {
        name,
        email,
        message
    }
    sendEmail(data)
}