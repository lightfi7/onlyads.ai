const mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  store: {},
  id: Number,
  custom_domain: String,
  custom_domain_search: String,
  title: String,
  handle: String,
  images: Number,
  variants: Number,
  category: Number,
  main_image: String,
  original_price: String,
  usd_price: Number,
  created_at: {type: String, index: true},
  tracked_by: String,
  random_sort: String,
  week_sales: Number,
  week_revenue: Number,
  month_sales: Number,
  month_revenue: Number,
  quarter_sales: Number,
  quarter_revenue: Number,
  aggregations: {},
  facebook_add_library: String,
  is_tracked: Boolean,
  is_locked: Boolean,
});

const TopProduct = mongoose.model("topproducts", productSchema);
module.exports = TopProduct;
