const user = require("./user.model.js");
const membership = require("./membership.model.js");
const invoice = require("./invoice.model.js");
const ads = require("./ads.model.js");
const setting = require("./setting.model.js");
const products = require("./sales-tracker/product.model.js");
const charts = require("./sales-tracker/chart.model.js");
const topstore = require("./sales-tracker/topstore.model.js");
const topproduct = require("./sales-tracker/topproduct.model.js");
const storeproduct = require("./sales-tracker/storeproduct.model.js");
const nexus_product = require("./nexus/product.model.js");
const nexus_chart = require("./nexus/chart.model.js");
const nexus_trend = require("./nexus/trend.model.js");
const nexus_supplier = require("./nexus/supplier.model.js");

const status = require("./status.model.js");

module.exports = {
  user,
  membership,
  invoice,
  ads,
  products,
  charts,
  topstore,
  topproduct,
  storeproduct,
  nexus_chart,
  nexus_product,
  nexus_trend,
  nexus_supplier,
  setting,
  status,
};
