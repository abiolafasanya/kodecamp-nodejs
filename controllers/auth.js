require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const path = require("path");
const fs = require("fs");
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { Users } = require("../models/User");
let userProfile = require("../models/profile");
const mailService = require("../service/mail");

exports.register = async (req, res) => {
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
      accountID: uuid(),
      profileID: uuid(),
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    Users.push(user);
    let profile = {
      ...user,
      address: null,
      location: 'lagos',
      phone: "+2348102307473",
      photo: null,
      occupation: 'Electrical Engineer/Software Developer'
    };
    // console.log("profile", profile);
    Users.push(profile);
    userProfile.push(profile);
    // console.log(user);
    const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
    
    mailService.sendEmail({
      email: data.email,
      subject: "Verify your account",
      body: `
        <h3>Hi, ${data.name}</h3> 
        <p>
          Please click on the verification link below to activaate your account
          <br>
          <a href="${fullUrl}/user/verify/?secure="/${token}>Click to verify</a>
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

exports.login = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).required(),
    password: joi.string().required(),
  });

  try {
    let data = await objSchema.validateAsync(req.body);
    console.log(data);
    let { email, password } = data;
    let user = Users.find((user) => {
      if (user.email === email) return true;
      else return false;
    });
    if (user) {
      console.log(user);
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
  console.log('Account verified')
  let token = req.query.secure
  console.log(token)
}