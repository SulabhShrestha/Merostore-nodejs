const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  //   uid: String,

  storeName: String,
  transactionType: {
    type: String,
    enum: ["cash", "credit", "prepaid", "return", "settlement", "desposited"],
  },

  // stock details
  details: {
    type: Map,
    of: String,
    required: false,
  },
});

const Sales = mongoose.model("Sales", InStockSchema);

module.exports = Sales;