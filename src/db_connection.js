const mongoose = require("mongoose");

// connecting to mongodb
const connectDB = function () {
  mongoose
    .connect(process.env.MongoDbURL)
    .then(() => console.log("Connected successfully."))
    .catch((e) => console.log("Error occurred" + e));
};

module.exports = connectDB;
