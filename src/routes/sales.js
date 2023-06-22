const express = require("express");
const router = express.Router();

const SalesModel = require("../models/sales_model");

// return all store names
router.get("/", async function (req, res) {
  const allData = await SalesModel.find({});
  res.json(allData);
});

// Add new sales
router.post("/addNew", async function (req, res) {
  console.log(req.body);

  const transactionType = req.body["Transaction Type"].toLowerCase();
  const storeName = req.body["Store Name"].toLowerCase();

  const sales = new SalesModel({
    transactionType,
    storeName,
    details: req.body.details,
  });

  // trying to save
  try {
    await sales.save();

    res.json({
      isSaved: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while saving the store.");
  }
});

module.exports = router;
