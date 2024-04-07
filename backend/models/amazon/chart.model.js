const mongoose = require("mongoose");
var chartSchema = mongoose.Schema({
  productId: String,
  rows: [],
  tick: [],
});

const Chart = mongoose.model("amazon_charts", chartSchema);
module.exports = Chart;