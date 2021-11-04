require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { SECRET } = process.env;
const joi = require("joi");
const { v4: uuid } = require("uuid");
const { userModel } = require("../models/users");
const { tokenModel } = require("../models/token");
const mailService = require("../service/mail");
const { resetPassword } = require("../public/js/emailResetTemplate");
// password reset
exports.requestPwdReset = async (req, res) => {
  const objSchema = joi.object({
    email: joi.string().email().required(),
  });
  try {
    let data = await objSchema.validateAsync(req.body);
    let { email } = data;
    // console.log(email)
    const user = await userModel.findOne({ email: email });
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    let token = await tokenModel.findOne({ userId: user._id });
    console.log(token);
    if (!token) {
      token = await new tokenModel({
        userId: user._id,
        token: uuid(),
      }).save();

      // send reset password email
      const Url = req.protocol + "://" + req.get("host");
      mailService.sendEmail({
        email: data.email,
        subject: "Verify your account",
        body: resetPassword({
          name: user.name,
          Url,
          token: uuid(),
          userId: user._id,
        }),
      });
      // response to CLIENT
      res.status(200).json({
        ok: ture,
        message: "An email with instruction has been sent to your " + email,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ ok: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  console.log("hello reset password");
  const objSchema = joi.object({
    password: joi.string().required(),
  });
  try {
    let data = await objSchema.validateAsync(req.body);
    let { password } = data;

    const user = await userModel.findOne({ _id: req.params.id });
    console.log(user, password);
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
};

// create new user