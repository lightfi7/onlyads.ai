const mongoose = require("mongoose");
var schema = mongoose.Schema(
  {
    paypal: String,
    color: {},
  },
  { timestamps: true }
);

const Setting = mongoose.model("settings", schema);
module.exports = Setting;
