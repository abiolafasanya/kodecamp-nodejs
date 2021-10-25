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
      accountId: uuid(),
      profileId: uuid(),
      password,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    // check if user exists
    let ifEmailExists = Users.find((user) => {
      if (user.email === data.email) return true;
      else return false;
    });
    // end of checking
    if (ifEmailExists)
      return res.status(400).json({
        message: "Email already taken",
      });

    Users.push(user);
    const profile = {
      ...user,
      address: "fawole street",
      location: "lagos",
      phone: "+2348102307473",
      photo: null,
      occupation: "Electrical Engineer/Software Developer",
    };
    // console.log("profile", profile);
    Users.push(profile);
    userProfile.push(profile);
    // console.log(user);
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
      let activateUser = Users.find((user) => {
        if (user.id === id) return true;
        else return false;
      });
      if (activateUser) {
        let index, status, updatedAt, activateAt, activate;
        index = Users.findIndex((user) => user.id === id);
        status = "active";
        updatedAt = new Date().toISOString();
        activateAt = new Date().toISOString();
        activate = { status, updatedAt, activateAt };
        Users.splice(index, 1, activate);

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
