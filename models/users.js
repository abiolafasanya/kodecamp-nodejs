const { Schema, model } = require("mongoose");
// users Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
      trim: true,
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "tutor", "student", "member"],
      default: "member",
    },
  },
  { timestamps: true }
);

//user profile schema
const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      tirm: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "activee"],
      default: "pending",
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "tutor", "student", "member"],
      default: "member",
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    location: {
      type: String,
      trim: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

exports.userModel = model("users", userSchema);
exports.profileModel = model("profile", profileSchema);
