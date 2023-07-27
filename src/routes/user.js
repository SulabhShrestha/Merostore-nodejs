const express = require("express");
const UserModel = require(__dirname + "/../models/user_model.js");

const router = express.Router();

router.post("/add", async function (req, res){
  const { email, name, profileUrl, userId } = req.body;

  // First checking if it is previously added to db
  const data = await UserModel.findOne({ userId: userId });

  console.log(`data: ${data}`);

  if(data){
    res.status(400).send("User already exists.");
    return;
  }

  const newUser = new UserModel({
    email,
    name,
    profileUrl,
    userId
  });

  try {
    const saveRes = await newUser.save();

    if (saveRes) {
      res.status(201).send("Saved successfully");
    } else {
      res.status(500).send("Error occurred while saving the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while saving the store.`);
  }
});

module.exports = router;
