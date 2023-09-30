const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["cash", "credit", "prepaid", "return", "settlement", "desposited"],
    },
    // stock details
    details: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sales", SalesSchema);

module.exports = Sales;
