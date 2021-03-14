const { gql } = require("apollo-server-express");

exports.RootTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
  }
  type Message {
    id: ID!
    content: String!
    username: String!
    user: User
  }

  input MessageInput {
    content: String!
    username: String!
    # userId: ID!
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    # messages: [Message]
    addMessage(data: MessageInput!): Message
  }

  type Subscription {
    messages: [Message]
  }
`;
