require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel, profileModel, permissionModel } = require("../models/users");
const mailService = require("../service/mail");
// console.log(userModel, profileModel);

exports.signup = async (req, res) => {
  const objSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    cpassword: joi.ref("password"),
  });
  try {
    let data = await objSchema.validateAsync(req.body);
    let { name, email, password } = data;
    password = await bcrypt.hash(password, 10);
    // check if user exists
    const ifEmailExists = await userModel.findOne({ email });
    if (ifEmailExists) {
      return res.status(400).json({
        message: "Email already taken",
      });
    }

    // const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const Url = req.protocol + "://" + req.get("host");
    const payload = {
      name: name,
      email: email,
      Url: Url,
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });
    // create user
    const newUser = {
      name,
      email,
      password,
      confirmationCode: token,
    };
    const ifUser = await userModel.create(newUser);
    if (!ifUser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    //permission
    const permission = {
      user: ifUser._id,
    };
    const ifPermission = await permissionModel.create(permission);
    if (!ifPermission) {
      console.log("permission creation failed");
      return res
        .status(400)
        .json({ ok: false, message: "permission creation failed" });
    }
    console.log(ifPermission);

    // create profile
    const profile = {
      ...newUser,
      status: ifUser._id,
      permission: ifPermission._id,
    };
    await profileModel.create(profile);

    mailService.sendEmail({
      email: data.email,
      subject: "Verify your account",
      body: `
        <h1> Account Confirmation </h1>
        <h2>Hi, ${data.name}</h2> 
        <p>
          Please click on the verification link below to activaate your account
          <br>
          <a href="${Url}/user/verify/?token=${token}">Click to verify</a>
        </p>
      `,
    });

    res
      .status(201)
      .json({ ok: true, profile, message: "User Registration Successful" });
  } catch (err) {
    res.status(422).json({ ok: false, message: err.message });
  }
};

exports.signin = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).required(),
    password: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    let { email, password } = data;
    let user = await userModel.findOne({ email });
    if (user) {
      let isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        console.log(false, "failed");
        return res.status(400).json({
          ok: false,
          message: "Incorrect Password, User Login failed",
        });
      }
      console.log("password: %d", true);

      if (user.status != "activated") {
        console.log("pending verification");
        return res.status(401).json({
          ok: false,
          message: "Pending account. Please verify your email",
        });
      }
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, SECRET, { expiresIn: 86400 });
      return res.status(200).json({
        ok: true,
        message: "User loggedIn",
        token,
        id: user.id,
      });
    } else {
      res
        .status(404)
        .json({ ok: false, message: "Incorrect Email, user not found" });
    }
  } catch (err) {
    res.status(422).json({ ok: false, message: err.message });
  }
};

exports.verify = async (req, res) => {
  let confirmationCode = { confirmationCode: req.query.token };
  try {
    userModel.findOne(confirmationCode, async (err, user) => {
      if (!user) {
        console.log(err.message);
        return res.status(404).json({ ok: false, message: "User not found" });
      }
      let getURl = jwt.verify(user.confirmationCode, SECRET);
      //  let getURl = jwt.verify(confirmationCode, SECRET, (err, user)=> {
      //    if (user) return user.Url
      //   })
      console.log(getURl);
      let Url = await getURl.Url;
      user.status = "activated";
      user.save((err) => {
        if (err) {
          res.status(500).json({ message: err });
          return;
        }
        // account verification confirmation notification
        mailService.sendEmail({
          email: user.email,
          subject: "Account Activated",
          body: `
          <h1> Account Activated </h1>
          <h3>Hi, ${user.name}</h3> 
          <p>
            This is to notify you that your account ahas been activated
            <br>
            <a href="${Url}/profile">View your Profile</a>
          </p>
      `,
        });
        res.status(200).json({ ok: true, message: "account activated" });
      });
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
