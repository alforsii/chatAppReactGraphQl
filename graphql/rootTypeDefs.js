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
    createdAt: String!
  }

  input MessageInput {
    content: String!
    username: String!
    # userId: ID!
  }

  input SignupInput {
    email: String!
    password: String!
    firstName: String
    lastName: String
  }

  type AuthData {
    userId: ID
    token: String
    tokenExpiration: Int
    message: String
  }

  type Query {
    messages: [Message]
    allUsers: [User!]!
    getUser(id: ID!): User
    someUsers(page: Int!, limit: Int!): [User!]!
  }

  type Mutation {
    # messages: [Message]
    addMessage(data: MessageInput!): Message
    signup(data: SignupInput!): User!
    login(email: String!, password: String!): AuthData!
    isLoggedIn(token: String!): AuthData!
    remove: Boolean
  }

  type Subscription {
    messages: [Message]
  }
`;
