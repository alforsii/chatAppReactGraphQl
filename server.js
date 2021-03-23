require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 8000;

// DB config
require("./configs/db.configs");

// Cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", [process.env.FRONTEND_POINT]);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// app.use((req, res, next) => {
//   const authHeader = req.get("Authorization");
//   // console.log(authHeader);
//   next();
// });
// ApolloServer configs
const { apolloServer } = require("./configs/apolloServer.configs");
apolloServer.applyMiddleware({ app, path: "/graphql", cors: false });
apolloServer.installSubscriptionHandlers(httpServer);

// Make sure to call listen on httpServer, NOT on app.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
});
