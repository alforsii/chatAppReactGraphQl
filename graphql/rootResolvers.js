const { MessageResolvers } = require("./resolvers/messageResolvers");
const { AuthResolvers } = require("./resolvers/authResolvers");

exports.RootResolvers = {
  Query: {
    ...MessageResolvers.Query,
    ...AuthResolvers.Query,
  },
  Mutation: {
    ...MessageResolvers.Mutation,
    ...AuthResolvers.Mutation,
  },
  Subscription: {
    ...MessageResolvers.Subscription,
  },
};
