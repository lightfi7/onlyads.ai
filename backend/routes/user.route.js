const controller = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");
const router = require("express").Router();

module.exports = (app) => {
  router.post("/", controller.findAll);
  router.post("/getone", controller.findOne);
  router.post("/delete", controller.deleteOne);
  app.use("/api/users", [authJwt.verifyToken, authJwt.isAdmin], router);
};
