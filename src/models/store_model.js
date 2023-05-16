const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  //   uid: String,
  storeName: {
    type: String,
    required: true,
  },

  transactionTypes: {
    type: [String],
    required: true,
    default: undefined,
  },

  // stock details
  quantityTypes: {
    type: [String],
    required: true,
    default: undefined,
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
