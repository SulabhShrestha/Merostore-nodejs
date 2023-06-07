const express = require("express");
const router = express.Router();

const UserModel = require("../models/user_model");
const mongoose = require("../db_connection");


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
