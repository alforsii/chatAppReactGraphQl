const { ApolloServer, gql, PubSub } = require("apollo-server");

const messages = [];

const RootTypeDefs = gql`
  type Message {
    id: ID!
    context: String!
    user: String!
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    addMessage(context: String!, user: String!): Message
  }

  type Subscription {
    messages: [Message]
    addMessage: Message
  }
`;

const RootResolvers = {
  Query: {
    messages: () => {
      pubSub.publish("MESSAGES", { messages });
      return [...messages];
    },
  },
  Mutation: {
    addMessage: (root, args, { pubSub }) => {
      const newMsg = {
        id: messages.length,
        ...args,
      };
      messages.push(newMsg);
      pubSub.publish("NEW_MESSAGE", { addMessage: newMsg });

      return newMsg;
    },
  },
  //   getMessages: (_, _, { pubSub }) => pubSub.publish("MESSAGES", { messages }),
  Subscription: {
    addMessage: {
      subscribe: (root, args, { pubSub }) =>
        pubSub.asyncIterator(["NEW_MESSAGE"]),
    },
    messages: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator(["MESSAGES"]),
    },
  },
};

const pubSub = new PubSub();
const server = new ApolloServer({
  typeDefs: RootTypeDefs,
  resolvers: RootResolvers,
  subscriptions: {
    path: "/",
  },
  context: { pubSub },
});

server
  .listen(8000)
  .then((serverResponse) => {
    console.log(`Server ready at ${serverResponse.url}`);
    console.log(`🚀 Subscriptions ready at ${serverResponse.subscriptionsUrl}`);
  })
  .catch((err) => console.log(`Error in apollo server ${err}`));
