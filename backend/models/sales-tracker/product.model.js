const mongoose = require("mongoose");

var productSchema = mongoose.Schema({
  id: Number,
  handle: String,
  title: { type: String, sparse: true },
  created_at: { type: Date, index: true },
  images: Number,
  is_tracked: Boolean,
  main_image: String,
  variants: Number,
  monthly_revenue: Number,
  monthly_sales: Number,
  original_price: Number,
  original_price_max: Number,
  original_price_min: Number,
  usd_price: Number,
  product_type: String,
  category: String,
  quick_search: [],
  store: {
    id: Number,
    internal_shop_id: Number,
    original_domain: String,
    best_ranked_domain: String,
    created_at: String,
    currency: String,
    custom_domain: String,
    favicon: String,
    is_tracked: Boolean,
    products_count: Number,
    shopify_shop_id: Number,
  },
  usd_price_min: Number,
  usd_price_max: Number,
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;
