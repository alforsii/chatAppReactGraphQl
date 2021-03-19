const { Chat } = require("../../models/Chat.model");
const { User } = require("../../models/User.model");

exports.ChatResolvers = {
  Query: {
    // => user chats array | id, chatName
    // =-=-==-=-=  Instead using Subscribe userChats!!! =-=-=-=-=-=-=-=-=-=-=
    userChats: async (_, { userId }) => {
      //   try {
      //     const user = await User.findById(userId).populate([
      //       {
      //         path: "chats",
      //         // populate: [
      //         //   { path: "chatAuthor" },
      //         //   { path: "chatUsers" },
      //         //   {
      //         //     path: "chatMessages",
      //         //     populate: [{ path: "messageAuthor" }],
      //         //   },
      //         // ],
      //       },
      //     ]);
      //     return user.chats;
      //   } catch (err) {
      //     console.log(err);
      //     return err;
      //   }
    },
    // => users array in single chat | id, email, firstName, lastName
    // =-=-==-=-=  Instead using Subscribe chatUsers!!! =-=-=-=-=-=-=-=-=-=-=
    chatUsers: async (_, { chatId }) => {
      //   try {
      //     const chat = await Chat.findById(chatId).populate([
      //       { path: "chatUsers" },
      //     ]);
      //     return chat.chatUsers;
      //   } catch (err) {
      //     console.log(err);
      //     return err;
      //   }
    },
  },
  Mutation: {
    // (parent, args, context, info)
    // => newly created chat | id, chatName
    createChat: async (_, { userId, chatName }, { pubSub }) => {
      try {
        const newChat = await Chat.create({
          chatName,
          chatAuthor: userId,
          chatUsers: [userId],
        });

        // const currentChat = await Chat.findById(newChat._id).populate([
        //   { path: "chatAuthor" },
        //   //   { path: "chatUsers" },
        // ]);

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $push: { chats: newChat._id },
          },
          { new: true, runValidators: true }
        ).populate([
          {
            path: "chats",
            // populate: [
            //   { path: "chatAuthor" },
            //   { path: "chatUsers" },
            // ],
          },
        ]);

        // Update user Chats
        pubSub.publish(`USER_CHATS-${updatedUser._id}`, {
          userChats: updatedUser.chats,
        });
        // pubSub.publish("channel", {
        //   [SubscriptionName]: data,
        // });

        return newChat;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    addChatUser: async (_, { otherUserId, chatId }, { pubSub }) => {
      try {
        const theChat = await Chat.findById(chatId);
        if (!theChat) return console.log("no chat found");
        const isUserExist = theChat.chatUsers.includes(otherUserId);
        console.log("🚀 isUserExist", isUserExist);
        if (isUserExist) {
          throw new Error(
            `User already exists in this chat ${theChat.chatName}!`
          );
        }

        const updatedChat = await Chat.findByIdAndUpdate(
          chatId,
          { $push: { chatUsers: otherUserId } },
          { new: true }
        ).populate([
          {
            path: "chatUsers",
          },
        ]);

        const updatedOtherUser = await User.findByIdAndUpdate(
          otherUserId,
          {
            $push: { chats: updatedChat._id },
          },
          { new: true, runValidators: true }
        ).populate([
          {
            path: "chats",
            // populate: [
            //   { path: "chatAuthor" },
            //   { path: "chatUsers" },
            // ],
          },
        ]);
        // 1. Update current added chat to otherUser chat list
        pubSub.publish(`USER_CHATS-${updatedOtherUser._id}`, {
          userChats: updatedOtherUser.chats,
        });
        // 2. Update current chat users list for all users since it's the only chat for all
        pubSub.publish(`CHAT_USERS-${updatedChat._id}`, {
          chatUsers: updatedChat.chatUsers,
        });

        return updatedChat;
      } catch (err) {
        console.log(err);
        return err;
      }
    },
  },
  Subscription: {
    chatUsers: {
      subscribe: async (_, { chatId }, { pubSub }) => {
        try {
          const chat = await Chat.findById(chatId).populate([
            { path: "chatUsers" },
          ]);
          setTimeout(() => {
            // pubSub.publish(`channel`, { [SubscriptionName]: data });
            pubSub.publish(`CHAT_USERS-${chat._id}`, {
              chatUsers: chat.chatUsers,
            });
          }, 0);
          //     pubSub.asyncIterator([`channel`]);
          return pubSub.asyncIterator([`CHAT_USERS-${chat._id}`]);
        } catch (err) {
          console.log(err);
          return err;
        }
      },
    },
    userChats: {
      subscribe: async (_, { userId }, { pubSub }) => {
        try {
          const user = await User.findById(userId).populate([
            {
              path: "chats",
              //   populate: [
              //     { path: "chatAuthor" },
              //     { path: "chatUsers" },
              //   ],
            },
          ]);
          setTimeout(() => {
            // pubSub.publish(`channel`, { [SubscriptionName]: data });
            pubSub.publish(`USER_CHATS-${user._id}`, { userChats: user.chats });
          }, 0);
          //     pubSub.asyncIterator([`channel`]);
          return pubSub.asyncIterator([`USER_CHATS-${user._id}`]);
        } catch (err) {
          console.log(err);
          return err;
        }
      },
    },
  },
};
