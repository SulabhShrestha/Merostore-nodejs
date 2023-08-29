const mongoose = require("mongoose");
const Store = require("./store_model");

const InStockSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    }, // user id
    storeName: {
      type: Store,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },

    // stock details
    details: {
      type: Map,
      of: String,
      required: true,
    },
  },
  { timestamps: true }
);

const InStock = mongoose.model("InStock", InStockSchema);

module.exports = InStock;
