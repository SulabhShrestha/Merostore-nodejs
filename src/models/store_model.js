const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },

    // what type of transaction that this store will be dealing with
    transactionTypes: {
      type: [String],
      required: true,
    },

    // quantity that this store will deal with
    quantityTypes: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
