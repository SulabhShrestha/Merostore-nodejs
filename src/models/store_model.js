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
  },

  // stock details
  quantityTypes: {
    type: [String],
    required: true,
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
