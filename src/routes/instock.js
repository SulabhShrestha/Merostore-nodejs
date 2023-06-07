const express = require("express");
const router = express.Router();

const InStockModel = require("../models/instock_model");
const UserModel = require("../models/user_model");
const mongoose = require("../db_connection");

// return all stocks
router.get("/", async function (req, res) {

  const allData = await InStockModel.find({});
  res.json(allData);
});

router.post("/addNew", async function(req, res){
  console.log(req.body);

  let isSaved = false;
  const transactionType = req.body["Transaction Type"].toLowerCase();
  const storeName = req.body["Store Name"].toLowerCase();

  const instock = new InStockModel({
    transactionType,
    storeName,
    details: req.body.details,
  });

  // trying to save
  try {
    await instock.save();

    // adding stock id to the respective user 
    isSaved = await addStockID(instock._id);
    
    res.json({
      isSaved: isSaved,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while saving the store.");
  }
});


async function addStockID(stockID) {
  try {
    await UserModel.updateOne(
      { name: "Sulabh Shrestha" }, // this is temporary
      { $push: { stocks: stockID } }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = router;
