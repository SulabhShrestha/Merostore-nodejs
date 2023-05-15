const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  //   uid: String,
  storeName: String,

  transactionTypes: {
    type: [String],
  },

  // stock details
  quantityTypes: {
    type: [String],
  },
});

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
