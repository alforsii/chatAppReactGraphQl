const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
  },
  { timestamps: true }
);

exports.User = model("User", UserSchema);
