const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const UserModel = require("../models/user_model");

// connecting to mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/MeroStore")
  .then(() => console.log("Connected successfully."))
  .catch((e) => console.log("Error occurred" + e));



router.post("/create", function (req, res) {
  console.log("Inside user");

  let isSaved = false;
  

  const user = new UserModel({
    name: "Sulabh Shrestha",
  });

  user
    .save()
    .then(() => (isSaved = true))
    .catch(() => (isSaved = false));

  res.json({
    isSaved: isSaved,
  });
});

module.exports = router;
