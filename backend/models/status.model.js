const mongoose = require("mongoose");
var schema = mongoose.Schema(
  {
    ads: {
      updatedAt: { type: Date, default: Date.now() },
      running: { type: Boolean, default: false },
    },
    topproduct: {
      updatedAt: { type: Date, default: Date.now() },
      running: { type: Boolean, default: false },
    },
    topstore: {
      updatedAt: { type: Date, default: Date.now() },
      running: { type: Boolean, default: false },
    },
    product: {
      updatedAt: { type: Date, default: Date.now() },
      running: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Status = mongoose.model("status", schema);
module.exports = Status;
