const mongoose = require("mongoose");
var chartSchema = mongoose.Schema({
  productId: { type: String, index: true, unique: true },
  rows: [],
  tick: [],
});

const Chart = mongoose.model("nexus_charts", chartSchema);
module.exports = Chart;