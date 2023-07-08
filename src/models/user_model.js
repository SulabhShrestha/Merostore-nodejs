const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const UserSchema = new mongoose.Schema({
  name: String,
  storeNames: [
    // holds array of reference of store collection
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
  ],

  // adding stock
  stocks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InStock",
    },
  ],
});

UserSchema.plugin(findOrCreate);

const User = mongoose.model("User", UserSchema);

module.exports = User;
