const mongoose = require("mongoose");

var storeSchema = mongoose.Schema({
  shopify_shop_id: Number,
  internal_shop_id: Number,
  custom_domain: String,
  original_domain: String,
  best_ranked_domain: String,
  all_domains: [String],
  custom_domain_search: String,
  title: String,
  favicon: String,
  logo: String,
  currency: String,
  languages: String,
  created_at: { type: String, index: true },
  products_count: Number,
  tracked_by: String,
  best_selling_products: {},
  random_sort: String,
  week_sales: Number,
  week_revenue: Number,
  month_sales: Number,
  month_revenue: Number,
  quarter_sales: Number,
  quarter_revenue: Number,
  aggregations: {},
  chart2: {type: mongoose.Schema.Types.ObjectId, ref: 'chart2s'},
  facebook_add_library: String,
  is_tracked: Boolean,
  is_locked: Boolean,
});

const TopStore = mongoose.model("topstores", storeSchema);
module.exports = TopStore;
