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
    messages: [Message]
  }

  type Subscription {
    messages: [Message]
  }
`;

const subscriptions = [];
// const onNewMessage = (fn) => subscriptions.push(fn);

const RootResolvers = {
  Query: {
    // messages: () => {
    //   return [...messages];
    // },
  },
  Mutation: {
    addMessage: (root, args, { pubSub }) => {
      const newMessage = {
        id: messages.length,
        ...args,
      };
      messages.push(newMessage);
      // pubSub.publish("NEW_MESSAGE", { newMessage });
      pubSub.publish("MESSAGES", { messages });
      //   subscriptions.forEach((fn) => fn());
      return newMessage;
    },
    messages: () => {
      return [...messages];
    },
  },
  //   getMessages: (_, _, { pubSub }) => pubSub.publish("MESSAGES", { messages }),
  Subscription: {
    // newMessage: {
    //   subscribe: (root, args, { pubSub }) =>
    //     pubSub.asyncIterator("NEW_MESSAGE"),
    // },
    messages: {
      subscribe: (_, __, { pubSub }) => {
        // const userChannel = Math.random().toString(36).slice(2, 15);
        // onNewMessage(() => pubSub.publish(userChannel, { messages }));
        // setTimeout(() => pubSub.publish(userChannel, { messages }), 0);
        return pubSub.asyncIterator("MESSAGES");
      },
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
