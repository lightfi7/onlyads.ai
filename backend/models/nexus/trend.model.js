const mongoose = require("mongoose");
var trendSchema = mongoose.Schema({
  productId: String,
  rows: [],
  tick: [],
});
const Trend = mongoose.model("nexus_trends", trendSchema);
module.exports = Trend;