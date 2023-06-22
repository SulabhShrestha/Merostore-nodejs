const express = require("express");

const router = express.Router();

const StoreModel = require("../models/store_model");

// return all store names
router.get("/", async function (req, res) {
  const allData = await StoreModel.find({});
  res.json(allData);
});


/**
 * Add new store
 *
 * Endpoint: POST /store/add
 *
 * @body {"storename", "quantityTypes", "transactionTypes"} - Json data of new store
 */

router.post("/add", async function (req, res) {
  const storeName = req.body.storeName;
  const quantityTypes = req.body.quantityTypes;
  const transactionTypes = req.body.transactionTypes;

  // checking if it is empty
  if (
    quantityTypes == undefined ||
    storeName == undefined ||
    transactionTypes == undefined
  ) {
    res
      .status(400)
      .send("Missing required fields.");
    return;
  }

  const newStore = new StoreModel({
    storeName: storeName.toLowerCase(),
    quantityTypes,
    transactionTypes,
  });

  try {
    const saveRes = await newStore.save();

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
