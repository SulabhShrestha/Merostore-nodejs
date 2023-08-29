const express = require("express");
const UserModel = require("../models/user_model");
const authChecker = require("../middleware/authChecker");

const router = express.Router();

/**
 * returns all user
 */
router.get("/", async function (req, res) {
  const allData = await UserModel.find();
  res.json(allData);
});

/**
 * @api {post} /user/create Create a new user
 * stores: [mongoose.Schema.Types.ObjectId],
 *
 */
router.post("/create", async function (req, res) {
  const { email, name, profileUrl, uid, stores } = req.body;

  // First checking if it is previously added to db
  const data = await UserModel.findOne({ uid });

  if (data) {
    res.status(400).send("User already exists.");
    return;
  }

  const newUser = new UserModel({
    email,
    name,
    profileUrl,
    uid,
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

// adding store to the user
router.patch("/update", authChecker, async function (req, res) {
  const { email, name, profileUrl, stores } = req.body;

  console.log("req.headers.authorization", req.headers.authorization);

  try {
    const updateRes = await UserModel.findOneAndUpdate(
      { uid: req.headers.authorization },
      {
        email,
        name,
        profileUrl,
        stores,
      }
    );
    console.log("updateRes", updateRes);

    if (updateRes) {
      res.status(201).send("Updated successfully");
    } else {
      res.status(500).send("Error occurred while updating the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while updating the store. ${err}`);
  }
});

module.exports = router;
