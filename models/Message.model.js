const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    content: { type: String, require: true },
    username: { type: String, require: true },
    messageAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);

exports.Message = model("Message", MessageSchema);
