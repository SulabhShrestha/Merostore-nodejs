const mongoose = require("mongoose");

const InStockSchema = new mongoose.Schema({
//   uid: String,
  cash: {
    type: Map,
    of: String,
    required: false,
  },
  credit: {
    type: Map,
    required: false,
  },
  prepaid: {
    type: Map,
    required: false,
  },
  return: {
    type: Map,
    required: false,
  },
});

const InStock = mongoose.model("InStock", InStockSchema);

module.exports = InStock;