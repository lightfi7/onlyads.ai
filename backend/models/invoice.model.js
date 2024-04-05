const mongoose = require('mongoose');
const User = require('./user.model')
var schema = mongoose.Schema(
  {
    membershipType: String,
    price: String,
    issuedDate: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
      type: Date,
      default: Date.now()
    },
    user: {type: mongoose.Schema.Types.ObjectID, ref: 'users'},
  },
  { timestamps: true }
);

schema.post('save', function(doc, next){
  User.findById(doc.user._id).then((user)=>{
    if(!user)
    return next(user);
    if(user.invoices)
      user.invoices = []
    user.invoices.push(doc);
    user.save().then(()=>{
      next()
    })
  })
})

schema.post('remove', function(doc, next){
  User.findById(doc.user._id).then((user)=>{
    if(!user){
      return next();
    }
    if(user.invoices)
      user.invoices = []
    user.invoices = user.invoices.filter(item => item._id != doc._id)
    user.save().then(()=>{
      next()
    })
  })
})

const Invoice = mongoose.model("invoices", schema);
module.exports = Invoice;