const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  });

exports.tokenModel = model("tokens", tokenSchema);
