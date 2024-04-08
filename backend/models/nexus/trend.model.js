const mongoose = require("mongoose");
var trendSchema = mongoose.Schema({
  productId: { type: String, index: true, unique: true },
  rows: [],
  tick: [],
});
const Trend = mongoose.model("nexus_trends", trendSchema);
module.exports = Trend;
