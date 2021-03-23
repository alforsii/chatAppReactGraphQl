import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

// // 1. One way of doing Apollo client
const wsLink = new WebSocketLink({
  uri: "ws://localhost:8000/subscriptions",
  options: {
    reconnect: true,
    // connectionParams: {
    //   authToken: JSON.parse(token),
    // },
  },
});

export const client = new ApolloClient({
  link: wsLink,
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

// 2. Another way of doing Apollo client
// const httpLink = new HttpLink({
//   // Server GraphQL endpoint
//   uri: "http://localhost:8000/graphql",
// });
// const subscriptionLink = new WebSocketLink({
//   // Server GraphQL Subscription endpoint
//   uri: "ws://localhost:8000/subscriptions",
//   options: {
//     // Reconnect in case client disconnects and connects again
//     reconnect: true,
//   },
// });

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   subscriptionLink,
//   httpLink
// );

// export const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(), // In memory cache
// });
