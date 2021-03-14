const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    content: { type: String, require: true },
    username: { type: String, require: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

exports.Message = model("Message", MessageSchema);
