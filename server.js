require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8000;

// DB config
require("./configs/db.configs");
// ApolloServer configs
const { apolloServer } = require("./configs/apolloServer.configs");

// app.use((req, res, next) => {
//   const authHeader = req.get("Authorization");
//   // console.log(authHeader);
//   next();
// });

apolloServer.installSubscriptionHandlers(httpServer);
apolloServer.applyMiddleware({ app, path: "/", cors: false });

// Make sure to call listen on httpServer, NOT on app.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
});
