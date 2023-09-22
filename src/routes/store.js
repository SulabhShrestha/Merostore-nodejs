const express = require("express");
const router = express.Router();

const StoreModel = require("../models/store_model");

/**
 * returns all store names
 *
 * Endpoint: GET /store
 *
 */
router.get("/", async function (req, res) {
  const uid = req.headers.authorization;

  const allData = await StoreModel.find({ uid });
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

  const uid = req.headers.authorization;

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
    console.log(saveRes);

    if (saveRes) {
      res.status(201).send(saveRes);
    } else {
      res.status(500).send("Error occurred while saving the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while saving the store. ${err}`);
  }
});

/**
 * Delete added store
 *
 * Endpoint: DELETE /store/:id
 */
router.delete("/:id", async function (req, res) {
  const storeId = req.params.id;
  const userId = req.headers.authorization;

  if (!storeId || !userId) {
    res.status(400).send("Missing required fields.");
    return;
  }

  try {
    const store = await StoreModel.findById(storeId);

    if (!store) {
      res.status(404).send("Store not found.");
      return;
    }

    // Check if the userId in the request headers matches the userId associated with the store
    if (store.uid.toString() !== userId) {
      res
        .status(403)
        .send("Unauthorized. You do not have permission to delete this store.");
      return;
    }

    const deleteRes = await StoreModel.findByIdAndDelete(storeId);

    if (deleteRes) {
      res.status(200).send("Deleted successfully");
    } else {
      res.status(500).send("Error occurred while deleting the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while deleting the store. ${err}`);
  }
});

/**
 * Update store
 *
 * Endpoint: PATCH /store/:id
 */
router.patch("/:id", async function (req, res) {
  const id = req.params.id;
  const storeName = req.body.storeName;
  const quantityTypes = req.body.quantityTypes;
  const transactionTypes = req.body.transactionTypes;

  try {
    const updateRes = await StoreModel.findByIdAndUpdate(id, {
      storeName,
      quantityTypes,
      transactionTypes,
    });

    if (updateRes) {
      res.status(200).send("Updated successfully");
    } else {
      res.status(500).send("Error occurred while updating the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while updating the store. ${err}`);
  }
});

module.exports = router;
