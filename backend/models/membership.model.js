const mongoose = require('mongoose');
const User = require('./user.model')
var schema = mongoose.Schema(
  {
    type: String,
    description: String,
    amount: String,
    issuedDate: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        default: Date.now()
    },
    status: Boolean,
    limit: {
      n: Number,
      date: Date
    },
    user: {type: mongoose.Schema.Types.ObjectID, ref: 'users'},
  },
  { timestamps: true }
);

schema.post('save', function(doc, next){
  User.findById(doc.user._id).then((user)=>{
    if(!user)return next();
    if(user.memberships)
      user.memberships = []
    user.memberships.push(doc);
    user.save().then(()=>{
      next()
    })
  })
})
  
const Membership = mongoose.model("memberships", schema);
module.exports = Membership;