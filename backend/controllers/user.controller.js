const db = require("../models");
const User = db.user;

// Retrieve all users from the database.
exports.findAll = async (req, res) => {
  let total = await User.countDocuments({});

  User.find({})
    .populate("memberships")
    .populate("invoices")
    .then((data) => {
      res.send({
        total: total,
        users: data,
      });
    });
};

// Find a single user with an id
exports.findOne = (req, res) => {
  const id = req.body.id;

  User.findById(id)
    .populate("memberships")
    .populate("invoices")
    .then((data) => {
      if (!data) res.status(500).send({ message: "not found" });
      else res.send({ user: data });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteOne = (req, res) => {
  const { id } = req.body;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then((user) => {
      res.send(user._id);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
