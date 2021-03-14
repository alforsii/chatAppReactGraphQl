const { MessageResolvers } = require("./messages/messageResolvers");

exports.RootResolvers = {
  Query: {
    ...MessageResolvers.Query,
  },
  Mutation: {
    ...MessageResolvers.Mutation,
  },
  Subscription: {
    ...MessageResolvers.Subscription,
  },
};
