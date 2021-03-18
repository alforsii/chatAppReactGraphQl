const { gql } = require("apollo-server-express");

exports.RootTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    chats: [Chat!]
  }

  type Chat {
    id: ID!
    chatName: String!
    chatAuthor: User!
    chatMessages: [Message!]
    chatUsers: [User!]
  }
  type Message {
    id: ID!
    content: String!
    username: String!
    messageAuthor: User!
    chatId: ID!
    createdAt: String!
  }

  input MessageInput {
    content: String!
    username: String!
    userId: ID!
    chatId: ID!
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
    someUsers(page: Int!, limit: Int!): [User!]!
    userChats(userId: ID!): [Chat]
    chatUsers(chatId: ID!): [User!]
  }

  type Mutation {
    getUser(id: ID!): User
    addMessage(data: MessageInput!): Message
    signup(data: SignupInput!): User!
    login(email: String!, password: String!): AuthData!
    isLoggedIn(token: String!): AuthData!
    createChat(userId: ID!, chatName: String!): Chat!
    addChatUser(otherUserId: ID!, chatId: ID!): Chat
    searchedUser(email: String!): User
  }

  type Subscription {
    messages(chatId: ID!): [Message]
    userChats(userId: ID!): [Chat]
    chatUsers(chatId: ID!): [User]
  }
`;
