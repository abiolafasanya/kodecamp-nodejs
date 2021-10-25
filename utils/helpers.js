// email check if already exists
exports.emailExists = (users, email) => {
     // check if user exists 
     let ifEmailExists = users.find(user => {
        if(user.email === email) return true
        else return false
      })
    // end of checking
    if (ifEmailExists) return res.status(400).json({
      message: `Email already taken <${email}>`
    })
}