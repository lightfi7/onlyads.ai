const mongoose = require("mongoose");
var schema = mongoose.Schema(
  {
    paypal: String,
    color: {},
    intercom: {
      
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model("settings", schema);
module.exports = Setting;
