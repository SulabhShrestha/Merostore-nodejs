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
  const uid = req.body.uid;

  // checking if it is empty
  if (!uid || !quantityTypes || !storeName || !transactionTypes) {
    res.status(400).send("Missing required fields.");
    return;
  }

  const newStore = new StoreModel({
    storeName: storeName.toLowerCase(),
    quantityTypes,
    transactionTypes,
    uid,
  });

  try {
    const saveRes = await newStore.save();

    if (saveRes) {
      res.status(201).send("Saved successfully");
    } else {
      res.status(500).send("Error occurred while saving the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while saving the store. ${err}`);
  }
});

module.exports = router;
