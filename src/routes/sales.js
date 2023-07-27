const express = require("express");
const router = express.Router();

const SalesModel = require("../models/sales_model");

/**
 * Retrieves all stocks including any storename
 *
 * Endpoint: GET /sales
 *
 */
router.get("/", async function (req, res) {

  const allData = await SalesModel.find();
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
  console.log(req.body);

  const transactionType = req.body["Transaction Type"];
  const storeName = req.body["Store Name"];
  const details = req.body["details"];

  // checking if it is empty
  if (
    transactionType == undefined ||
    storeName == undefined ||
    details == undefined
  ) {
    res.status(400).send("Missing required fields.");
    return;
  }

  // checking if material is previously added,
  // if it exists, values is updated

  const ifExists = await SalesModel.findOne({
    storeName,
    "details.Material Name": details["Material Name"],
  });

  const sales = new SalesModel({
    transactionType: transactionType.toLowerCase(),
    storeName: storeName.toLowerCase(),
    details,
  });

  try {
    const saveRes = await sales.save();

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
