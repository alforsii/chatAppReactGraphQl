require("dotenv").config();
const { ApolloServer, PubSub } = require("apollo-server-express");
const { RootResolvers } = require("./graphql/rootResolvers");
const { RootTypeDefs } = require("./graphql/rootTypeDefs");
const express = require("express");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((db) => {
    console.log(`Connected to DB: ${db.connections[0].name} `);
  })
  .catch((err) => console.log(`Error in DB connection ${err}`));

const pubSub = new PubSub();
const server = new ApolloServer({
  typeDefs: RootTypeDefs,
  resolvers: RootResolvers,
  // subscriptions: {
  //   path: "/",
  // },
  subscriptions: { path: "/" },
  context: { pubSub },
});

const app = express();
const http = require("http");
const PORT = process.env.PORT || 8000;
server.applyMiddleware({ app, path: "/", cors: false });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Make sure to call listen on httpServer, NOT on app.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
