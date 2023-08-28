const express = require("express");
const UserModel = require(__dirname + "/../models/user_model.js");

const router = express.Router();

/**
 * @api {post} /user/create Create a new user
 * stores: [mongoose.Schema.Types.ObjectId],
 *
 */
router.post("/create", async function (req, res) {
  const { email, name, profileUrl, userId, stores } = req.body;

  // First checking if it is previously added to db
  const data = await UserModel.findOne({ userId: userId });

  if (data) {
    res.status(400).send("User already exists.");
    return;
  }

  const newUser = new UserModel({
    email,
    name,
    profileUrl,
    userId,
    stores,
  });

  try {
    const saveRes = await newUser.save();

    if (saveRes) {
      res.status(201).send("Create successfully");
    } else {
      res.status(500).send("Error occurred while saving the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while saving the store. ${err}`);
  }
});

module.exports = router;
