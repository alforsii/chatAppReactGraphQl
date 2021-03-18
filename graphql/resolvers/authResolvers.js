const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/User.model");

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.SECRET_TOKEN, {
    expiresIn: "1d",
  });
};

exports.AuthResolvers = {
  Query: {
    allUsers: async () => {
      return await User.find().sort({ _id: 1 });
    },
    someUsers: async (_, { page, limit }) => {
      const skip = page * limit;
      return await User.find().sort({ _id: 1 }).skip(skip).limit(limit);
    },
  },
  Mutation: {
    searchedUser: async (_, { email }) => {
      try {
        return await User.findOne({ email });
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    getUser: async (_, { id }) => {
      try {
        return await User.findById(id);
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    isLoggedIn: async (_, { token }) => {
      if (!token || token === "") {
        return null;
      }
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        if (!decodedToken || !decodedToken.userId || !decodedToken.email) {
          throw new Error("Not authorized!");
        }
        const isUserExist = await User.findById(decodedToken.userId);
        if (!isUserExist) {
          throw new Error("This account no longer exists!");
        }
        // const newToken = generateToken(decodedToken.userId, decodedToken.email);
        return { userId: decodedToken.userId, token, tokenExpiration: 1 };
      } catch (err) {
        console.log(err.message);
        return err;
      }
    },
    signup: async (_, { data }) => {
      try {
        let user = await User.findOne({ email: data.email });
        if (user) throw new Error("This email already registered!");
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;
        user = await User.create(data);

        return user;
      } catch (err) {
        console.log(err);
        // return { message: err.message };
        return err;
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          // return { userId: null, token: null, message: "User not found!" };
          throw new Error("User not found!");
        }
        const isEqual = await bcryptjs.compare(password, user.password);

        if (!isEqual) {
          // return { userId: null, token: null, message: "Incorrect password!" };
          throw new Error("Wrong password!");
        }

        const token = generateToken(user.id, email);
        // req.user = user;
        // theToken = token;
        return { userId: user.id, token, tokenExpiration: 1 };
      } catch (err) {
        console.log(err);
        return err;
        // return { message: err.message };
      }
    },
  },
  Subscription: {
    // searchedUser: {
    //   subscribe: async (_, { email }, { pubSub }) => {
    //     try {
    //       const user = await User.findOne({ email });
    //       setTimeout(() => {
    //         // pubSub.publish(`channel`, { [SubscriptionName]: data });
    //         pubSub.publish(`searched-${user._id}`, { searchedUser: user });
    //       }, 0);
    //       //     pubSub.asyncIterator([`channel`]);
    //       return pubSub.asyncIterator([`searched-${user._id}`]);
    //     } catch (err) {
    //       console.log(err);
    //       return err;
    //     }
    //   },
    // },
  },
};
