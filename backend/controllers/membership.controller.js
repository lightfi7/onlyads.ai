const db = require("../models");
const Membership = db.membership;
const Invoice = db.invoice;
const User = db.user;

exports.create = (req, res) => {
  const userId = req.body.id;
  const membershipType = req.body.membershipType;
  const amount = req.body.amount;
  const description = req.body.description;

  const issuedDate = new Date();

  let dueDate = issuedDate;

  switch (membershipType) {
    case "Basic":
      dueDate = new Date(
        issuedDate.getFullYear(),
        issuedDate.getMonth() + 1,
        issuedDate.getDate()
      );
      break;
    case "Standard":
      dueDate = new Date(
        issuedDate.getFullYear(),
        issuedDate.getMonth() + 1,
        issuedDate.getDate()
      );
      break;
    case "Enterprise":
      dueDate = new Date(
        issuedDate.getFullYear() + 1,
        issuedDate.getMonth(),
        issuedDate.getDate()
      );
      break;
    default:
      break;
  }

  // if(req.body.trial_period){
  //     expires_on = new Date(starts_on.getFullYear(), starts_on.getMonth(), starts_on.getDate()+3)
  // }

  const membership = new Membership({
    type: membershipType,
    description: description,
    amount: amount,
    issuedDate: issuedDate,
    dueDate: dueDate,
    status: true,
    user: userId,
  });

  membership
    .save()
    .then(async (data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.createByPayment = async (req, res) => {
  const userId = req.body.userId;
  const membershipType = req.body.membershipType;
  const membershipDescription = req.body.membershipDescription;
  const amount = req.body.amount;
  const issuedDate = new Date();
  let dueDate = issuedDate;
  switch (membershipType) {
    case "Basic":
      break;
    case "Standard":
      dueDate = new Date(
        issuedDate.getFullYear(),
        issuedDate.getMonth() + 1,
        issuedDate.getDate()
      );
      break;
    case "Enterprise":
      dueDate = new Date(
        issuedDate.getFullYear() + 1,
        issuedDate.getMonth(),
        issuedDate.getDate()
      );
      break;
    default:
      break;
  }
  try {
    const user = await User.findOne({ _id: userId });
    const membership = await Membership.create({
      type: membershipType,
      amount: amount,
      description: membershipDescription,
      issuedDate: issuedDate,
      dueDate: dueDate,
      status: true,
      user: user._id,
    });
    const invoice = await Invoice.create({
      membershipType: membershipType,
      price: amount,
      issuedDate: issuedDate,
      dueDate: dueDate,
      user: user._id,
    });
    res.send({
      status: "success",
      message: "Membership created successfully",
      data: membership,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};

// Retrieve all memberships from the database.
exports.find = async (req, res) => {
  const { id = "" } = req.body;

  const query = { user: id };
  let total = await Membership.countDocuments(query);

  Membership.find(query).then((data) => {
    res.send({
      total: total,
      memberships: data,
    });
  });
};

exports.findMe = (req, res) => {
  const query = { user: req.body.id };
  Membership.find(query)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

// Find a single membership with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Membership.findById(id)
    .then((data) => {
      if (!data) res.status(404).send({ message: "not found" });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Membership.findById(id)
    .then((membership) => {
      membership.title = req.body.title;
      membership.description = req.body.description;
      membership.amount = req.body.amount;
      membership.payment = req.body.payment;
      membership.trial_period = req.body.trial_period;
      membership.grace_period = req.body.grace_period;
      membership.next_payment_due = req.body.next_payment_due;
      membership.starts_on = req.body.starts_on;
      membership.expires_on = req.body.expires_on;
      membership.status = req.body.status;
      membership
        .save()
        .then(() => [
          res.send({ message: "updated successfully", membership: membership }),
        ])
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.toggle = (req, res) => {
  const { id } = req.body;

  Membership.findById(id)
    .then((membership) => {
      membership.status = !membership.status;
      membership
        .save()
        .then(() => {
          res.send(membership._id);
        })
        .catch((err) => {
          res.status(401).send({ message: "failed" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err.message });
    });
};

exports.deleteOne = (req, res) => {
  const { id } = req.body;

  Membership.findByIdAndRemove(id, { useFindAndModify: false })
    .then((membership) => {
      User.findById(membership.user).then((user) => {
        user.memberships = user.memberships.filter((item) => item != id);
        user.save();
      });
      res.send(membership._id);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.deleteAll = (req, res) => {
  Membership.deleteMany({})
    .then(() => {
      res.send({ message: "removed all successfully" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
