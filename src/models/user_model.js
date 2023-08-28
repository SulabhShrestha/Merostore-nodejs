const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    profileUrl: String,
    userId: {
      type: String,
      required: [true, "Firebase UID is required"],
    }, // of firebase
    email: {
      type: String,
      required: [true, "Email is required"],
    },

    stores: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Store",
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
