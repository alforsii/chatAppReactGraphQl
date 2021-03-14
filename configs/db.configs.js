const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((db) => {
    console.log(`Connected to DB: ${db.connections[0].name} `);
  })
  .catch((err) => console.log(`Error in DB connection ${err}`));
