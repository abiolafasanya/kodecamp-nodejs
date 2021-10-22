require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;
const path = require("path");
const fs = require("fs");
const joi = require("joi");
const { v4: uuid } = require("uuid");
const cred = [];
let userProfile = require("../models/profile");

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
    let user = { id: uuid(), name, email, password };
    cred.push(user);
    let profile = {
      ...user,
      address: null,
      phone: null,
      active: false,
      photo: null,
    };
    console.log("profile", profile);
    userProfile.push(profile);
    console.log(user);
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
    let { email, password } = data;
    console.log(cred);
    cred.find((user) => {
      if (user.email !== email) {
        return res
          .status(404)
          .json({ ok: false, message: "Incorrect Email, user not found" });
      }
      let isPassword = bcrypt.compareSync(password, user.password);
      if (!isPassword) {
        console.log(false, "failed");
        return res
          .status(400)
          .json({ ok: false, message: "User Login failed" });
      }
      console.log(true);
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
    });
  } catch (err) {
    res.status(422).json({ ok: false, message: err.details[0].message });
  }
};
