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
  const allData = await InStockModel.find({ uid: req.headers.authorization });
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

  const allData = await InStockModel.find({
    storeName,
    uid: req.headers.authorization,
  });
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
  const allData = await InStockModel.find({
    storeName: req.params.storeName.toLowerCase(),
  });

  if (allData.length == 0) {
    res.status(404).send("No material found");
    return;
  }

  console.log("All data: ", typeof allData);

  const materialNames = allData.map(function (data) {
    console.log("Data: ", data.details);
    return data.details.get("Material Name");
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

  // checking if it is empty
  if (!transactionType || !storeName || !details) {
    res.status(400).send("Missing required fields.");
    return;
  }

  // checking if store exists
  const storeExists = await StoreModel.findOne({ storeName });
  if (!storeExists) {
    res.status(400).send("Store doesn't exists.");
    return;
  }

  // checking if material is previously added,
  // if it exists, returning duplicate data error
  const previousData = await InStockModel.findOneAndUpdate(
    {
      uid: req.headers.authorization,
      storeId: storeExists._id,
      "details.materialName": details["materialName"],
      "details.broughtQuantityType": details["broughtQuantityType"],
    },
    {
      $set: {
        transactionType: transactionType.toLowerCase(),
        storeId: storeExists._id,
        uid: req.headers.authorization,
      },
      $inc: {
        "details.totalPrice": details["totalPrice"],
        "details.broughtQuantity": details["broughtQuantity"],
      },
    }
  );

  // if something in [previousData] means we had added current data to previous data
  if (previousData) {
    res.status(200).send("Updated successfully.");
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
      res.status(201).send("Saved successfully");
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

router.get(
  "/materialDetails/:storeName/:materialName",
  async function (req, res) {
    const storeName = req.params.storeName.toLowerCase();
    const materialName = req.params.materialName.toLowerCase();

    // checking if it is empty
    if (storeName == undefined || materialName == undefined) {
      res.status(400).send("Missing required fields.");
      return;
    }

    // There should be only one material with same name in a store
    const materialDetails = await InStockModel.findOne({
      "details.Material Name": materialName,
      storeName,
    });

    if (materialDetails) {
      res.json(materialDetails);
    } else {
      res.status(404).send("No material found");
    }
  }
);

module.exports = router;
