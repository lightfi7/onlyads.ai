const mongoose = require("mongoose");
var supplierSchema = mongoose.Schema({
  productId: { type: String, index: true, unique: true },
  choosen_shipping_method: String,
  choosen_shipping_method_mandatory: Boolean,
  matchingProducts: [],
  matchingProducts_count: Number,
  products: [],
  products_count: Number,
  shipping_methods: [],
});

const Supplier = mongoose.model("nexus_suppliers", supplierSchema);
module.exports = Supplier;