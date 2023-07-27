const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  profileUrl: String, 
  userId: String, 
  email: String, 
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User;
