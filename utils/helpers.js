// email check if already exists
ifEmailExists = (users, email) => {
  let ifEmailExists = users.find(user => {
    if(user.email === email) return true
    else return false
  })
  return ifEmailExists
}

// genetate code
generateCode = () => {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10)
  }
  return code
}
console.log(generateCode())

saveToken = (user, token) => {
  user.token = token
  return user
}


// token = await new tokenModel({
//   userId: user._id,
//   token: uuid(),
// }).save();