const db = require("../models");
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    userName: req.body.userName,
  }).then((user) => {
    if (user) {
      res.status(400).send("Failed! Username is already in use.");
      return;
    }

    // Email
    User.findOne({
      email: req.body.email,
    }).then((user) => {
      if (user) {
        res.status(400).send("Failed! Email is already in use.");
        return;
      }

      next();
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
