const mongoose = require("mongoose");

const InStockSchema = new mongoose.Schema({
//   uid: String,
  
  storeName: String,
  transactionType: {
    type: String, 
    enum: ["cash", "credit", "prepaid", "return"],
  },

  // stock details
  details: {
    type: Map,
    of: String,
    required: false,
  },
  
});

const InStock = mongoose.model("InStock", InStockSchema);

module.exports = InStock;