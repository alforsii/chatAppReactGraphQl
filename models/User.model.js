const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    firstName: { type: String },
    lastName: { type: String },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);

exports.User = model("User", UserSchema);
