const db = require("../models");
const Ads = db.ads;
const Product = db.products;

refresh = (req, res, next) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - 5);
    Ads.deleteMany({ createdAt: { $lt: cutoffDate } })
      .then(() => {})
      .catch((err) => {});

    Product.deleteMany({ created_at: { $lt: cutoffDate } })
      .then(() => {})
      .catch((err) => {});
    next();
  } catch (err) {
    console.log(err);
    next();
  }
};

const DB = {
  refresh,
};

module.exports = DB;
