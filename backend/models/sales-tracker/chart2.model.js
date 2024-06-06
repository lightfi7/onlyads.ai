const mongoose = require("mongoose");

var chart2Schema = mongoose.Schema({
  week: {},
  month: {},
  quarter: {},
});

const Chart2 = mongoose.model("chart2s", chart2Schema);
module.exports = Chart2;
