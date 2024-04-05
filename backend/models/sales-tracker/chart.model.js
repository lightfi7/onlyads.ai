const mongoose = require("mongoose");

var chartSchema = mongoose.Schema({
  pid: { type: mongoose.Schema.Types.ObjectID, ref: "products" },
  chart: [],
  last_updated: Date,
});

const Chart = mongoose.model("charts", chartSchema);
module.exports = Chart;
