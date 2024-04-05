const User = require("../models/user.model.js");
const Membership = require("../models/membership.model.js");

const MEMTYPES = ["Basic", "Standard", "Enterprise"];

checkMembership = (req, res, next) => {
  if (req.role == "admin") {
    req.expired = false;
    next();
    return;
  }
  User.findById(req.userId)
    .populate("memberships")
    .then(async (user) => {
      if (!user) {
        res.status(401).send("Failed! User not found");
        return;
      }
      let expired = true,
        membership = null;
      const m2d = [];
      const mm = user.memberships.filter(async (m) => {
        if (m.status == true && new Date(m.dueDate) > new Date()) {
          return true;
        } else {
          m2d.push(m._id);
          await Membership.deleteOne({ _id: m._id });
          return false;
        }
      });
      if (mm.length)
        membership = mm.reduce((prev, current) => {
          return MEMTYPES.indexOf(prev.type) > MEMTYPES.indexOf(current.type)
            ? prev
            : current;
        });

      user.memberships = user.memberships.filter((m) => !m2d.includes(m._id));
      await user.save();
      if (membership) {
        expired = false;
        req.membership = membership;
      }
      req.expired = expired;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Failed to check membership, try again or contact!");
    });
};

const verifyMembership = {
  checkMembership: checkMembership,
};

module.exports = verifyMembership;
