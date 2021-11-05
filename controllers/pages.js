const path = require("path");
const {contactModel} = require("../models/contact");
const {userModel} = require("../models/users");
const mailService = require("../service/mail");

exports.contactPage = (req, res) => {
  res.status(200).render("/", { message: "hello world" });
  console.log("Hello world this is abiola fasanya");
};

exports.profile = async (req, res) => {
  console.log("Profile Upload page");
  let findUser = await userModel.findOne({_id: req.params.id})
  if(!findUser){
    console.log('User not found')
    res.status(404).json({ok: false, message: "user not found"})
  }
  res.sendFile(path.resolve("./views/profile.html"));
};

exports.register = (req, res) => {
  console.log("SignUp page");
  res.sendFile(path.resolve("./views/register.html"));
};

exports.login = (req, res) => {
  console.log("SignIn page");
  res.sendFile(path.resolve("./views/login.html"));
};

exports.requestPwdReset = (req, res) => {
  console.log("SignIn page");
  res.sendFile(path.resolve("./views/pwdreset.html"));
};

exports.createPassword = (req, res) => {
  console.log("SignIn page");
  let { id, token } = req.params;
  console.log(id, token);
  res.sendFile(path.resolve("./views/createpassword.html"));
};

exports.contact = async (req, res) => {
  console.log("Hello world this is contact page");
  const objSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    message: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    console.log(data);
    let { name, email, message } = data;

    console.log(name, email, message);
    if (!name || !email || !message) {
      console.log("Unprocessed Entity");
      res.status(422).json({
        ok: false,
        message: "Please fill all fields",
      });
    } else {
      console.log({ name, email, message });
      contactModel.create({ name, email, message });

      mailService.sendEmail({
        email: email,
        subject: "Your message has been received",
        body: `
        <h3>Hi, ${name}</h3> 
        <p>
          Thank you for your response, it has been recorded, we will get back to you shortly
        </p>
      `,
      });

      res.status(200).json({
        ok: true,
        message: "Message sent succesfuly",
      });
    }

  } catch (err) {
    res.status(500).json({
      ok: false,
      message: err.message
    })    
  } 
};
