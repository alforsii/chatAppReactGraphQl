const { Chat } = require("../../models/Chat.model");
const { Message } = require("../../models/Message.model");

exports.MessageResolvers = {
  Query: {
    // messages: async () => {
    //   const messages = await Message.find();
    //   return messages;
    // },
  },
  Mutation: {
    // (parent, args, context, info)
    addMessage: async (
      root,
      { data: { content, username, userId, chatId } },
      { pubSub }
    ) => {
      try {
        const newMessage = await Message.create({
          content,
          username,
          messageAuthor: userId,
          chatId,
        });
        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          {
            $push: { chatMessages: newMessage._id },
          },
          { new: true, runValidators: true }
        ).populate([
          // { path: "chatAuthor" },
          { path: "chatMessages", populate: [{ path: "messageAuthor" }] },
        ]);

        const currentMessage = await Message.findById(newMessage._id).populate(
          "messageAuthor"
        );
        // const messages = await Message.find().populate("messageAuthor");
        pubSub.publish(`CHAT_MESSAGES-${updatedChat._id}`, {
          messages: updatedChat.chatMessages,
        });
        return currentMessage;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  },
  Subscription: {
    messages: {
      subscribe: async (_, { chatId }, { pubSub }) => {
        try {
          const chat = await Chat.findById(chatId).populate([
            // { path: "chatAuthor" },
            { path: "chatMessages", populate: [{ path: "messageAuthor" }] },
          ]);

          setTimeout(() => {
            pubSub.publish(`CHAT_MESSAGES-${chat._id}`, {
              messages: chat.chatMessages,
            });
          }, 0);
          return pubSub.asyncIterator(`CHAT_MESSAGES-${chat._id}`);
        } catch (err) {
          console.log(err);
          return err;
        }
      },
    },
  },
};
