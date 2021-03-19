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

        // 1.One to get chatMessages is to add array property to Chat model and push each new message
        // 2.Another just fond all chat messages through chatId that we add as property of the message. So I use 2 method as it will be easy when we need to remove the message!
        // const updatedChat = await Chat.findByIdAndUpdate(
        //   chatId,
        //   {
        //     $push: { chatMessages: newMessage._id },
        //   },
        //   { new: true, runValidators: true }
        // ).populate([
        //   // { path: "chatAuthor" },
        //   { path: "chatMessages", populate: [{ path: "messageAuthor" }] },
        // ]);
        // const messages = updatedChat.chatMessages

        // 2.Better way getting chat messages
        const messages = await Message.find({ chatId }).populate(
          "messageAuthor"
        );

        // Sent updated messages
        // const messages = await Message.find().populate("messageAuthor");
        pubSub.publish(`CHAT_MESSAGES-${chatId}`, {
          messages,
        });
        return newMessage;
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
          // const chat = await Chat.findById(chatId).populate([
          //   // { path: "chatAuthor" },
          //   { path: "chatMessages", populate: [{ path: "messageAuthor" }] },
          // ]);

          // 2.Better way getting chat messages
          const messages = await Message.find({ chatId }).populate(
            "messageAuthor"
          );

          setTimeout(() => {
            pubSub.publish(`CHAT_MESSAGES-${chatId}`, {
              messages,
            });
          }, 0);
          return pubSub.asyncIterator(`CHAT_MESSAGES-${chatId}`);
        } catch (err) {
          console.log(err);
          return err;
        }
      },
    },
  },
};
