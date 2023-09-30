const express = require("express");
const router = express.Router();

const InStockModel = require("../models/instock_model");
const StoreModel = require("../models/store_model");

/**
 * Retrieves all stocks including all stores
 *
 * Endpoint: GET /instock/{storeName}
 */
router.get("/", async function (req, res) {
  const allData = await InStockModel.find({
    uid: req.headers.authorization,
  }).populate("storeId");
  res.json(allData);
});

/**
 * Retrieves all stocks based on storename
 *
 * Endpoint: GET /instock/{storeName}
 *
 * @param {string} storeName - The name of the store.
 */
router.get("/:storeName", async function (req, res) {
  const storeName = req.params.storeName.toLowerCase();

  // retreving store
  const store = await StoreModel.findOne({ storeName });

  const allData = await InStockModel.find({
    storeId: store._id,
    uid: req.headers.authorization,
  }).populate("storeId");
  res.json(allData);
});

/**
 * Retrieves all material names of specific store
 *
 * Endpoint: GET /instock/materialNames/{storeName}
 *
 * @param {string} storeName - The name of the store.
 *
 */
router.get("/materialNames/:storeName", async function (req, res) {
  const storeName = req.params.storeName.toLowerCase();
  // retreving store
  const store = await StoreModel.findOne({ storeName });

  const allData = await InStockModel.find({
    storeId: store._id,
  }).populate("storeId");

  if (allData.length == 0) {
    res.status(404).send("No material found");
    return;
  }

  const materialNames = allData.map(function (data) {
    return data.details.get("materialName");
  });
  res.json(materialNames);
});

/**
 * Add new material to a specific store
 *
 * Endpoint: POST /instock/add
 *
 * @body {"Transaction Type", "Store Name", "details"} - Json data of new material
 */
router.post("/add", async function (req, res) {
  const transactionType = req.body["transactionType"];
  const storeName = req.body["storeName"];
  const details = req.body["details"];
  const uid = req.headers.authorization;

  // checking if it is empty
  if (!transactionType || !storeName || !details) {
    res.status(400).send("Missing required fields.");
    return;
  }

  // checking if store exists
  const storeExists = await StoreModel.findOne({ storeName, uid });
  if (!storeExists) {
    res.status(404).send("Store not found.");
    return;
  }

  // checking if material is previously added,
  // if it exists, returning duplicate data error
  const previousData = await InStockModel.findOneAndUpdate(
    {
      uid: req.headers.authorization,
      storeId: storeExists._id,
      transactionType: transactionType.toLowerCase(),
      "details.materialName": details["materialName"],
      "details.broughtQuantityType": details["broughtQuantityType"],
      "details.creditorName": details["creditorName"],
      "details.debtorName": details["debtorName"],
    },
    {
      $set: {
        "details.description": details["description"],
      },
      $inc: {
        "details.totalPrice": details["totalPrice"],
        "details.broughtQuantity": details["broughtQuantity"],
      },
    },
    {
      new: true,
    }
  ).populate("storeId");

  // if something in [previousData] means we had added current data to previous data
  if (previousData) {
    res.status(200).send(previousData);
    return;
  }

  // else it's a new data, so creating new data
  const instock = new InStockModel({
    transactionType: transactionType.toLowerCase(),
    storeId: storeExists._id,
    details,
    uid: req.headers.authorization,
  });

  try {
    const saveRes = await instock.save();

    if (saveRes) {
      const newlyAddeddStock = await InStockModel.findOne({
        uid: saveRes.uid,
        _id: instock._id,
      }).populate("storeId");

      res.status(201).send(newlyAddeddStock);
    } else {
      res.status(500).send("Error occurred while saving the store.");
    }
  } catch (err) {
    res.status(500).send("Error occurred while saving the store. " + err);
  }
});

/**
 * Retrieves specific material data of a specific store
 *
 * Endpoint: GET /instock/materialDetails/{storeName}/{materialName}
 *
 * @param {string} storeName - The name of the store.
 * @param {string} materialName - The name of the material.
 * @returns {json} - Json data of matched material
 * @returns {string} - If no material is found
 *
 */

//TODO: needed to look this later
router.get(
  "/materialDetails/:storeName/:materialName",
  async function (req, res) {
    const storeName = req.params.storeName.toLowerCase();
    const materialName = req.params.materialName.toLowerCase();

    // checking if it is empty
    if (!storeName || !materialName) {
      res.status(400).send("Missing required fields.");
      return;
    }

    // retreving store
    const store = await StoreModel.findOne({ storeName });

    // There should be only one material with same name in a store
    const materialDetails = await InStockModel.findOne({
      "details.materialName": materialName,
      storeId: store._id,
    }).populate("storeId");

    if (materialDetails) {
      res.json(materialDetails);
    } else {
      res.status(404).send("No material found");
    }
  }
);

// Deletes the stock
router.delete("/:storeId/:stockId", async function (req, res) {
  const storeId = req.params.storeId;
  const stockId = req.params.stockId;
  const userId = req.headers.authorization;

  const deletedStock = await InStockModel.findOneAndDelete({
    uid: userId,
    storeId,
    _id: stockId,
  });

  if (deletedStock) {
    res.status(200).send("Deleted successfully.");
  } else {
    res.status(404).send("Stock not found.");
  }
});

// updates the stock
router.patch("/:storeId/:stockId", async function (req, res) {
  const storeId = req.params.storeId;
  const stockId = req.params.stockId;
  const userId = req.headers.authorization;

  const updated = await InStockModel.findOneAndUpdate(
    {
      uid: userId,
      storeId,
      _id: stockId,
    },
    {
      $set: req.body,
    },
    {
      new: true,
    }
  ).populate("storeId");

  if (updated) {
    res.status(200).send(updated);
  } else {
    res.status(404).send("Stock not found.");
  }
});

module.exports = router;
