const express = require("express");
const router = express.Router();

const SalesModel = require("../models/sales_model");
const StoreModel = require("../models/store_model");
const Sales = require("../models/sales_model");

/**
 * Retrieves all sales including any storename
 *
 * Endpoint: GET /sales
 *
 */
router.get("/", async function (req, res) {
  // Get the current date and time
  const currentDate = new Date();
  // Set the time to the start of the day (12:00 AM)
  currentDate.setHours(0, 0, 0, 0);

  // Calculate the end of the day (12:00 AM of the next day)
  const nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const allData = await SalesModel.find({
    uid: req.headers.authorization,
    createdAt: {
      $gte: currentDate,
    },
  }).populate("storeId");

  console.log(currentDate, nextDay);

  res.json(allData);
});

/***
 * Returns all sales
 */
router.get("/all", async function (req, res) {
  const allData = await SalesModel.find({
    uid: req.headers.authorization,
  }).populate("storeId");
  res.json(allData);
});

/**
 * Retrieves all sales based on storename of current date only
 * Used for populating sales page
 *
 * Endpoint: GET /sales/{currentDate}/{storeName}
 *
 * @param {string} storeName - The name of the store.
 * @param {string} currentData - Today's date, "2023-07-27T00:00:00.000+05:30"

 *
 */
router.get("/:currentDate/:storeName", async function (req, res) {
  const storeName = req.params.storeName.toLowerCase();
  const currentDateParam = req.params.currentDate;

  // Convert the currentDateParam to a Date object
  const currentDate = new Date(currentDateParam);

  try {
    // Use the currentDate directly in the MongoDB query
    const allData = await SalesModel.find({
      storeName: storeName,
      createdAt: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    res.json(allData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Add new sales transaction
 *
 * Endpoint: POST /sales/add
 *
 * @body {"Transaction Type", "Store Name", "details"} - Json data of new material
 */
router.post("/add", async function (req, res) {
  const transactionType = req.body["transactionType"];
  const storeName = req.body["storeName"];
  const details = req.body["details"];
  const uid = req.headers.authorization;

  // checking if it is empty
  if (
    transactionType == undefined ||
    storeName == undefined ||
    details == undefined
  ) {
    res.status(400).send("Missing required fields.");
    return;
  }

  // checking if store exists
  const storeExists = await StoreModel.findOne({ storeName, uid });
  if (!storeExists) {
    res.status(404).send("Store not found.");
    return;
  }

  const sales = new SalesModel({
    transactionType: transactionType.toLowerCase(),
    storeName: storeName.toLowerCase(),
    details,
    storeId: storeExists._id,
    uid,
  });

  try {
    const saveRes = await sales.save();

    if (saveRes) {
      const newlyAddeddSales = await SalesModel.findOne({
        uid: saveRes.uid,
        _id: sales._id,
      }).populate("storeId");

      res.status(201).send(newlyAddeddSales);
    } else {
      res.status(500).send("Error occurred while saving the store.");
    }
  } catch (err) {
    res.status(500).send(`Error occurred while saving the store.`);
  }
});

// Deletes the sales
router.delete("/:storeId/:salesId", async function (req, res) {
  const storeId = req.params.storeId;
  const salesId = req.params.salesId;
  const userId = req.headers.authorization;

  const deletedStock = await SalesModel.findOneAndDelete({
    uid: userId,
    storeId,
    _id: salesId,
  });

  if (deletedStock) {
    res.status(200).send("Deleted successfully.");
  } else {
    res.status(404).send("Stock not found.");
  }
});

// update the sales
router.patch("/:storeId/:salesId", async function (req, res) {
  const storeId = req.params.storeId;
  const salesId = req.params.salesId;
  const userId = req.headers.authorization;

  console.log(req.body);
  console.log(storeId, salesId);

  const updated = await SalesModel.findOneAndUpdate(
    {
      uid: userId,
      storeId,
      _id: salesId,
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
