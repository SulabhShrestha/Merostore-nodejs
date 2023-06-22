const mongoose = require("mongoose");

// connecting to mongodb

const connectDB = function() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/MeroStore")
    .then(() => console.log("Connected successfully."))
    .catch((e) => console.log("Error occurred" + e));
}


module.exports = connectDB;