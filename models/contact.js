const { Schema, model } = require("mongoose");
// contact Schema
const contactSchema = new Schema(
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
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

exports.contactModel = model("contacts", contactSchema);
