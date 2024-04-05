const mongoose = require('mongoose');
var schema = mongoose.Schema(
  {
    userName: String,
    email: String,
    password: String,
    role: String,
    avatar_path: String,
    deviceInfo: String,
    ipAddress:String,
    phoneNumber: String,
    address: String,
    state: String,
    zipCode: String,
    language: String,
    country: String,
    memberships: [{type: mongoose.Schema.Types.ObjectID, ref: 'memberships'}],
    invoices: [{type: mongoose.Schema.Types.ObjectID, ref: 'invoices'}]
  },
  { timestamps: true }
);
const User = mongoose.model("users", schema);
module.exports = User;