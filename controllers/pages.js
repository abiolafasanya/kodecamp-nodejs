const path = require('path')
const contactDB = require("../models/contact");

exports.index = (req, res) => {
  res.status(200).render("/", { message: "hello world" });
  console.log("Hello world this is abiola fasanya");
};

exports.profile = (req, res) => {
  console.log("Profile Upload page");
  res.sendFile(path.resolve("./views/profile.html"));
};

exports.signUp = (req, res) => {
  console.log("SignUp page");
  res.sendFile(path.resolve("./views/register.html"));
};

exports.signIn = (req, res) => {
  console.log("SignIn page");
  res.sendFile(path.resolve("./views/login.html"));
};

exports.processContact = (req, res) => {
  console.log("Hello world this success page");
  const { name, email, message } = req.body;
  console.log(name, email, message)
  if (!name || !email || !message) {
    console.log("Unprocessed Entity");
    res.status(422).json({
      ok: false,
      message: 'Please fill all fields'
    })
    // res.sendFile(path.resolve("./views/error.html"));
  } else {
    console.log({name, email, message});
    contactDB.push({name, email, message})
    res.status(200).json({
      ok: true,
      message: 'Message sent succesfuly'
    })
    // res.sendFile(path.resolve("./views/success.html"))
  }
};
