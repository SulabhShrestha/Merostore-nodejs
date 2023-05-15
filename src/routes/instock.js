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
router.get("/", async function (req, res) {

  const allData = await InStockModel.find({});
  res.json(allData);
});

router.post("/addNew", function(req, res){
  console.log(req.body);

  let isSaved = false;
  const transactionType = req.body["Transaction Type"].toLowerCase();

  const instock = new InStockModel({
    transactionType: transactionType,
    details: req.body.details,
    
  });

  instock.save().then(() => isSaved = true).catch(()=> isSaved = false);

  res.json({
    "isSaved": isSaved,
  })
});

module.exports = router;
