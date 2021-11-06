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
    // generate link to send to user
    let name = user.name;
    let userId = user._id;
    generatePasswordResetLink(userId, email, name, req, res);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ ok: false, message: err.message });
  }
};

exports.createPassword = async (req, res) => {
  console.log("hello reset password");
  const objSchema = joi.object({
    password: joi.string().required(),
  });
  try {
    let data = await objSchema.validateAsync(req.body);
    let { password } = data;

    const user = await userModel.findOne({ _id: req.params.id });
    console.log(user, password);
    if (!user) {
      console.log({ ok: false, message: "user not found" });
      return res.status(404).json({ ok: false, message: "User no found" });
    }
    // find token
    const token = await tokenModel.findOne({ userId: user._id });
    if (!token) {
      console.log({ ok: false, message: "invalid link or expired" });
      return res
        .status(400)
        .json({ ok: false, message: "invalid link or expired" });
    }
    console.log(token);
    user.password = bcrypt.hashSync(password, 10);
    await user.save();
    await token.delete();

    res.status(200).json({ ok: true, message: "password reset successful" });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
    console.log(err, err.message);
  }
};

generatePasswordResetLink = async (userId, email, name, req, res) => {
  try {
    const token = await tokenModel.findOne({ userId: userId });
    if (token) {
      await token.delete();
      res.json({ ok: false, message: "token already exists try again" });
    }
    if (!token) {
      console.log("creating and sending token");
      let genToken = uuid();
      await new tokenModel({
        userId,
        token: genToken,
      }).save();
      const Url = req.protocol + "://" + req.get("host");
      const link = `${Url}/reset-password/${userId}/${genToken}`;

      // send reset password email
      mailService.sendEmail({
        email: email,
        subject: "Password Reset",
        body: resetPassword(name, link),
      });

      // response to CLIENT
      res.status(200).json({
        ok: true,
        message: "An email with instruction has been sent to " + email,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ ok: false, message: err.message });
  }
};
