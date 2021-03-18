const { Schema, model } = require("mongoose");

const ChatSchema = new Schema(
  {
    chatName: { type: String, require: true },
    chatAuthor: { type: Schema.Types.ObjectId, ref: "User", require: true },
    chatMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    chatUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

exports.Chat = model("Chat", ChatSchema);
