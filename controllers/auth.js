require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const path = require("path");
const fs = require("fs");
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel, profileModel } = require("../models/users");
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
    let user = {
      id: uuid(),
      name,
      email,
      status: "pending",
      accountId: uuid(),
      profileId: uuid(),
      password,
    };
    // check if user exists
    const ifEmailExists = await userModel.findOne({ email });
    if (ifEmailExists)
      return res.status(400).json({
        message: "Email already taken",
      });

    const ifuser = userModel.create(user);
    if (!ifuser)
      return res.status(401).json({
        ok: false,
        message: "User not created",
      });

    const profile = {
      ...user,
      address: "fawole street",
      location: "lagos",
      phone: "+2348102307473",
      photo: null,
      occupation: "Electrical Engineer/Software Developer",
    };
    profileModel.create(profile);

    // const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const Url = req.protocol + "://" + req.get("host");
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      Url: Url,
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1h" });

    mailService.sendEmail({
      email: data.email,
      subject: "Verify your account",
      body: `
        <h3>Hi, ${data.name}</h3> 
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
    res.status(422).json({ ok: false, message: err.details[0].message });
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
      });
    } else {
      res
        .status(404)
        .json({ ok: false, message: "Incorrect Email, user not found" });
    }
  } catch (err) {
    res.status(422).json({ ok: false, message: err.details[0].message });
  }
};

exports.verify = async (req, res) => {
  console.log("Account verified");
  let token = req.query.token;
  console.log(token);
  try {
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        res.status(403).json({
          status: 403,
          message: "Token is not valid",
        });
        return;
      }
      let id = user.id;
      let email = user.email;
      let name = user.name;
      let Url = user.Url;
      let activate = {status: 'verified'}
      let activateUser = userModel.updateOne({email}, activate, (err, user) => {
        if(err){
          res.status(401).json({ok: false, message: err.message})  
        }
        if(!user) {
          res.status(404).json({
            ok: false,
            message: err.message,
          })
        }
      });
      if (activateUser) {
        mailService.sendEmail({
          email: email,
          subject: "Account Activated",
          body: `
          <h3>Hi, ${name}</h3> 
          <p>
            This is to notify you that your account ahas been activated
            <br>
            <a href="${Url}/profile">View your Profile</a>
          </p>
        `,
        });
        res.status(200).json({ ok: true, message: "account activated" });
      } else res.status(200).json({ ok: false, message: "activation failed" });
      // end
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
