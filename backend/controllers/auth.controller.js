const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Setting = db.setting;

const fs = require("fs");
const hash = require("../utils/hash");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const sendEmail = require("../utils/email/sendEmail");
const MEMTYPES = ["Basic", "Standard", "Enterprise"];

exports.signup = (req, res) => {
  User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: "user",
    avatar_path: "",
    deviceInfo: req.body.deviceInfo,
    ipAddress: req.body.ipAddress,
    phoneNumber: "",
    address: "",
    state: "",
    zipCode: "",
    language: "",
    country: "",
  })
    .then((user) => {
      const queryToken = {};
      queryToken.id = user._id;
      queryToken.role = user.role;

      const accessToken = jwt.sign(queryToken, config.secret, {
        expiresIn: 86400,
      });
      delete user["password"];
      res.status(200).send({ user, accessToken });
    })
    .catch((err) => {
      res.status(500).send("Something went wrong!");
    });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("memberships")
    .then(async (user) => {
      if (!user) {
        return res.status(500).send("Invalid email or password");
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(500).send("Invalid email or password");
      }

      user.ipAddress = req.body.ipAddress;
      user.deviceInfo = req.body.deviceInfo;
      user.save();

      const date = new Date();

      let expired = true,
        membership = null;
      const mm = user.memberships.filter(async (m) => {
        if (m.status == true && new Date(m.dueDate) > new Date()) {
          return true;
        } else {
          return false;
        }
      });
      if (mm.length)
        membership = mm.reduce((prev, current) => {
          return MEMTYPES.indexOf(prev.type) > MEMTYPES.indexOf(current.type)
            ? prev
            : current;
        });

      if (membership) {
        expired = false;
      }

      /** 2023/5/9 3:30 */
      /** Add more information */
      const queryToken = {};
      queryToken.id = user._id;
      queryToken.role = user.role;

      var accessToken = jwt.sign(queryToken, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      const { intercom_secret_key = "" } = await Setting.findOne({});
      const uhash = hash(intercom_secret_key, user.email);

      res.status(200).send({
        user: {
          _id: user._id,
          address: user.address,
          avatar_path: user.avatar_path,
          country: user.country,
          deviceInfo: user.deviceInfo,
          email: user.email,
          // invoices: user.invoices,
          ipAddress: user.ipAddress,
          language: user.language,
          // memberships: user.memberships,
          phoneNumber: user.phoneNumber,
          role: user.role,
          state: user.state,
          userName: user.userName,
          zipCode: user.zipCode,
          membership,
          expired,
          uhash,
        },
        accessToken,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Faild to sign in, try again or contact!");
    });
};

exports.me = (req, res) => {
  const id = req.userId;
  User.findById(id)
    .populate("invoices")
    .populate("memberships")
    .then(async (user) => {
      if (!user) {
        return res.status(500).send("User not found");
      }
      const { intercom_secret_key = "" } = await Setting.findOne({});
      const uhash = hash(intercom_secret_key, user.email);
      return res.send({
        accessToken: req.token,
        user: {
          _id: user._id,
          address: user.address,
          avatar_path: user.avatar_path,
          country: user.country,
          deviceInfo: user.deviceInfo,
          email: user.email,
          invoices: user.invoices,
          ipAddress: user.ipAddress,
          language: user.language,
          memberships: user.memberships,
          phoneNumber: user.phoneNumber,
          role: user.role,
          state: user.state,
          userName: user.userName,
          zipCode: user.zipCode,
          membership: req.membership,
          expired: req.expired,
          uhash,
        },
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send("Faild to get user information, try again or contact!");
    });
};

exports.profile = (req, res) => {
  User.findById(req.body.id)
    .populate("memberships")
    .populate("invoices")
    .then(async (user) => {
      if (!user) {
        return res.status(500).send("User not found");
      }
      res.status(200).send({
        user: {
          _id: user._id,
          address: user.address,
          avatar_path: user.avatar_path,
          country: user.country,
          deviceInfo: user.deviceInfo,
          email: user.email,
          invoices: user.invoices,
          ipAddress: user.ipAddress,
          language: user.language,
          memberships: user.memberships,
          phoneNumber: user.phoneNumber,
          role: user.role,
          state: user.state,
          userName: user.userName,
          zipCode: user.zipCode,
        },
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send("Failed to get user information, try again or contact!");
    });
};

exports.updateProfile = (req, res) => {
  const data = req.body;

  User.findOne({
    email: data.email,
  })
    .populate("invoices")
    .populate("memberships")
    .then(async (user) => {
      user.userName = data.name;
      user.address = data.address;
      user.phoneNumber = data.phoneNumber;
      user.state = data.state;
      user.zipCode = data.zipCode;
      await user.save();
      return res.status(200).send({
        user: {
          _id: user._id,
          address: user.address,
          avatar_path: user.avatar_path,
          country: user.country,
          deviceInfo: user.deviceInfo,
          email: user.email,
          invoices: user.invoices,
          ipAddress: user.ipAddress,
          language: user.language,
          memberships: user.memberships,
          phoneNumber: user.phoneNumber,
          role: user.role,
          state: user.state,
          userName: user.userName,
          zipCode: user.zipCode,
        },
        message: "Profile was changed",
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send("Failed to update user information, try again or contact!");
    });
};

exports.forgotPassword = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        const queryToken = {};

        /** Add more information */
        queryToken.id = user._id;

        var accessToken = jwt.sign(queryToken, config.secret, {
          expiresIn: 1200,
        });

        const clientURL = process.env.CLIENT_URL;
        const link = `${clientURL}/reset-password?token=${accessToken}&id=${user._id}`;
        sendEmail(
          user.email,
          "Password Reset Request",
          {
            name: user.userName,
            link: link,
          },
          "./template/requestResetPassword.handlebars"
        );
        console.log(link);
        // return { link };
        res
          .status(200)
          .send({ message: "Success to send reset password link" });
      } else res.status(500).send("User not found");
    })
    .catch((err) => {
      res
        .status(500)
        .send("Failed to send reset password link, try again or contact!");
    });
};

exports.resetPassword = (req, res) => {
  const userId = req.body.id;
  const token = req.body.token;

  if (!token) {
    return res.status(400).send("Invalid or expired password reset token,");
  }
  try {
    const { id } = jwt.verify(token, config.secret);
    if (id != userId) {
      return res.status(400).send("Invalid or expired password reset token,");
    }
    User.findById(id)
      .then(async (user) => {
        if (!user) {
          return res.status(400).send("User not found");
        }

        user.password = bcrypt.hashSync(req.body.password, 8);
        await user.save();
        res.status(200).send({ message: "Password was reseted successfully" });
      })
      .catch((err) => {
        res
          .status(500)
          .send("Failed to update password, try again or contact!");
      });
  } catch (e) {
    return res
      .status(500)
      .send("Failed to update password, try again or contact!");
  }
};
