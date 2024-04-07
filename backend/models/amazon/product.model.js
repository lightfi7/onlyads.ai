const mongoose = require("mongoose");
var schema = mongoose.Schema(
  {
    imageURL: String,
    videoURL: String,
    productId: String,
    productType: String,
    productLink: String,
    productName: String,
    productRating: String,
    productPrice: String,
    productSales: String,
    productOrdersPrice: String,
    productOrdersRanking: String,
    productDaily: String,
    productDailyRank: String,
    productOverall: String,
    productOverallRank: String,
    // _productRating: Number,
    _productPrice: Number,
    _productSales: Number,
    _productOrdersPrice: Number,
    _productOrdersRanking: Number,
    _productDaily: Number,
    _productDailyRank: Number,
    _productOverall: Number,
    _productOverallRank: Number,
  },
  { timestamp: true }
);

const Product = mongoose.model("amazon_products", schema);
module.exports = Product;
