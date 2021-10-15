const auth = require('../middleware/auth')

exports.login = (req, res) => {
    console.log('Hello login', req.body)
}