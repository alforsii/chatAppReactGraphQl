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
    addMessage: async (root, args, { pubSub }) => {
      const newMessage = await Message.create(args.data);
      const messages = await Message.find();
      pubSub.publish("MESSAGES", { messages });
      return newMessage;
    },
  },
  Subscription: {
    messages: {
      subscribe: (_, __, { pubSub }) => {
        setTimeout(async () => {
          const messages = await Message.find();
          pubSub.publish("MESSAGES", { messages });
        }, 0);
        return pubSub.asyncIterator("MESSAGES");
      },
    },
  },
};
