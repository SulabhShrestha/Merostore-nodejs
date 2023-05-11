const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const InStockModel = require("../models/instock_model");

// connecting to mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/MeroStore")
  .then(() => console.log("Connected successfully."))
  .catch((e) => console.log("Error occurred" + e));

// return all stocks
router.get("/", function (req, res) {
  res.json({
    hi: "hello",
  });
});

router.post("/addNew", function(req, res){
  console.log(req.body.transactionType);

  let isSaved = false;
  const transactionType = req.body["Transaction Type"].toLowerCase();

  console.log(transactionType);

  const instock = new InStockModel({
    [transactionType]: req.body
  });

  instock.save().then(() => isSaved = true).catch(()=> isSaved = false);

  res.json({
    "isSaved": isSaved,
  })
});

module.exports = router;
