const mongoose = require("mongoose");

var schema = mongoose.Schema({
  week: {},
  month: {},
  quarter: {},
});

const BestSellingProduct = mongoose.model("bsproducts", schema);
module.exports = BestSellingProduct;
