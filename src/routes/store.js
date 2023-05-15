const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const StoreModel = require("../models/store_model");

// connecting to mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/MeroStore")
  .then(() => console.log("Connected successfully."))
  .catch((e) => console.log("Error occurred" + e));

// return all store names
router.get("/", async function (req, res) {
  const allData = await StoreModel.find({});
  res.json(allData);
});

router.post("/addNew", async function (req, res) {
  console.log(req.body);

  let isSaved = false;

  const newStore = new StoreModel({
    storeName: req.body.storeName,
    quantityTypes: req.body.quantityTypes,
    transactionTypes: req.body.transactionTypes
  });

  try {
    await newStore.save();
    isSaved = true;
    res.json({
      isSaved: isSaved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while saving the store.");
  }
});

module.exports = router;
