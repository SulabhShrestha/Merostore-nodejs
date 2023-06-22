const express = require("express");
const router = express.Router();

const SalesModel = require("../models/sales_model");

/**
 * Retrieves all stocks based on storename
 *
 * Endpoint: GET /sales/{storeName}
 *
 * @param {string} storeName - The name of the store.
 *
 */
router.get("/:storeName", async function (req, res) {

  const storeName = req.params.storeName.toLowerCase();

  const allData = await SalesModel.find({storeName});
  res.json(allData);
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
    res
      .status(400)
      .send("Missing required fields.");
    return;
  }

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
