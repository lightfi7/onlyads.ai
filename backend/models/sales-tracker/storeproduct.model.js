const mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  store: {},
  title: String,
  handle: String,
  images: Number,
  variants: Number,
  main_image: String,
  original_price: String,
  usd_price: Number,
  created_at: { type: String, index: true },
});

const StoreProduct = mongoose.model("storeproducts", productSchema);
module.exports = StoreProduct;
