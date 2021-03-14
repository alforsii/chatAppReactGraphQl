const { ApolloServer, PubSub } = require("apollo-server-express");
const { RootResolvers } = require("../graphql/rootResolvers");
const { RootTypeDefs } = require("../graphql/rootTypeDefs");
const { User } = require("../models/User.model");

const pubSub = new PubSub();

const validateToken = (token) => {
  // ... validate token and return a Promise, rejects in case of an error
  if (!token || token === "") {
    return null;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (err) {
    console.log(err.message);
    return err;
  }

  if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
    throw new Error("Not authorized!");
  }
  // const newToken = generateToken(decodedToken.userId, decodedToken.email);
  return { userId: decodedToken.userId, token, tokenExpiration: 1 };
};

exports.apolloServer = new ApolloServer({
  typeDefs: RootTypeDefs,
  resolvers: RootResolvers,
  subscriptions: {
    path: "/",
    // onConnect: (connectionParams, webSocket, context) => {
    //   console.log({ connectionParams });
    //   if (connectionParams.authToken) {
    //     return validateToken(connectionParams.authToken).then(
    //       async (tokenData) => {
    //         const user = await User.findById(tokenData.userId);
    //         return {
    //           currentUser: user,
    //         };
    //       }
    //     );
    //   }

    //   throw new Error("Missing auth token!");
    // },
    // onDisconnect: (webSocket, context) => {
    //   console.log("Disconnected!");
    // },
  },
  // context: { pubSub },
  context: ({ req, connection }) => {
    // console.log({ req, connection });
    if (connection) {
      // Operation is a Subscription
      // Obtain connectionParams-provided token from connection.context
      const token = connection.context.authorization || "";
      return { req, token, pubSub };
    } else {
      // Operation is a Query/Mutation
      // Obtain header-provided token from req.headers
      const token = req.headers.authorization || "";
      return { req, token, pubSub };
    }
  },
});
