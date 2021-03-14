const { ApolloServer, PubSub } = require("apollo-server-express");
const { RootResolvers } = require("../graphql/rootResolvers");
const { RootTypeDefs } = require("../graphql/rootTypeDefs");

const pubSub = new PubSub();

const validateToken = (authToken) => {
  // ... validate token and return a Promise, rejects in case of an error
};

const findUser = (authToken) => {
  return (tokenValidationResult) => {
    // ... finds user by auth token and return a Promise, rejects in case of an error
  };
};
exports.apolloServer = new ApolloServer({
  typeDefs: RootTypeDefs,
  resolvers: RootResolvers,
  subscriptions: {
    path: "/",
    onConnect: (connectionParams, webSocket, context) => {
      console.log({ connectionParams });
      // if (connectionParams.authToken) {
      //   return validateToken(connectionParams.authToken)
      //     .then(findUser(connectionParams.authToken))
      //     .then((user) => {
      //       return {
      //         currentUser: user,
      //       };
      //     });
      // }

      // throw new Error("Missing auth token!");
    },
    onDisconnect: (webSocket, context) => {
      console.log("Disconnected!");
    },
  },
  // context: { pubSub },
  context: ({ req, connection }) => {
    // console.log({ req, connection });
    if (connection) {
      // Operation is a Subscription
      // Obtain connectionParams-provided token from connection.context
      const token = connection.context.authorization || "";
      return { token, pubSub };
    } else {
      // Operation is a Query/Mutation
      // Obtain header-provided token from req.headers
      const token = req.headers.authorization || "";
      return { token, pubSub };
    }
  },
});
