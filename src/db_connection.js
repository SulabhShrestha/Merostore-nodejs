const mongoose = require("mongoose");

// connecting to mongodb

const connectDB = function () {
  console.log(process.env.MongoDbURL);
  mongoose
    .connect(process.env.MongoDbURL)
    .then(() => console.log("Connected successfully."))
    .catch((e) => console.log("Error occurred" + e));
};

module.exports = connectDB;
