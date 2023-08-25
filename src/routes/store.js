const express = require("express");
const router = express.Router();

const StoreModel = require("../models/store_model");

/**
 * returns all store names
 *
 * Endpoint: GET /store
 * authorization: user id
 *
 */
router.get("/", async function (req, res) {
  const uid = req.headers.authorization;

  // if no header is passed
  if (!uid) {
    res.status(401).send("Unauthorized");
    return;
  }
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

  // if no header is passed
  if (!uid) {
    res.status(401).send("Unauthorized");
    return;
  }

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

/**
 * Delete added store
 *
 * Endpoint: DELETE /store/:id
 */

router.delete("/:id", async function (req, res) {
  const id = req.params.id;
  const uid = req.headers.authorization;

  // if no header is passed
  if (!uid) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!id) {
    res.status(400).send("Missing required fields.");
    return;
  }

  try {
    const deleteRes = await StoreModel.findByIdAndDelete(id);

    if (deleteRes) {
      res.status(201).send("Deleted successfully");
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

  const uid = req.headers.authorization;

  // if no header is passed
  if (!uid) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const updateRes = await StoreModel.findByIdAndUpdate(id, {
      storeName,
      quantityTypes,
      transactionTypes,
    });

    if (updateRes) {
      res.status(201).send("Updated successfully");
    } else {
      res.status(500).send("Error occurred while updating the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while updating the store. ${err}`);
  }
});

module.exports = router;
