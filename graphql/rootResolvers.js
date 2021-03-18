const { MessageResolvers } = require("./resolvers/messageResolvers");
const { AuthResolvers } = require("./resolvers/authResolvers");
const { ChatResolvers } = require("./resolvers/chatResolvers");

exports.RootResolvers = {
  Query: {
    ...MessageResolvers.Query,
    ...AuthResolvers.Query,
    ...ChatResolvers.Query,
  },
  Mutation: {
    ...MessageResolvers.Mutation,
    ...AuthResolvers.Mutation,
    ...ChatResolvers.Mutation,
  },
  Subscription: {
    ...MessageResolvers.Subscription,
    ...ChatResolvers.Subscription,
  },
};
