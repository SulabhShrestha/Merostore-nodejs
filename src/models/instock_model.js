const mongoose = require("mongoose");
const Store = require("./store_model");

const InStockSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    }, // user id
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },

    // stock details
    details: {
      type: Map,
      required: true,
    },
  },
  { timestamps: true }
);

const InStock = mongoose.model("InStock", InStockSchema);

module.exports = InStock;
