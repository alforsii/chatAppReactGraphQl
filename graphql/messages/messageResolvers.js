const { Message } = require("../../models/Message");

exports.MessageResolvers = {
  Query: {
    // messages: () => {
    //   return [...messages];
    // },
  },
  Mutation: {
    // (parent, args, context, info)
    addMessage: async (root, args, { pubSub }) => {
      const newMessage = await Message.create(args.data);
      const messages = await Message.find();
      pubSub.publish("MESSAGES", { messages });
      return newMessage;
    },
    messages: async () => {
      return await Message.find();
    },
  },
  Subscription: {
    messages: {
      subscribe: (_, __, { pubSub }) => {
        return pubSub.asyncIterator("MESSAGES");
      },
    },
  },
};
