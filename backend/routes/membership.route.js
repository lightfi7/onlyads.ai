const controller = require("../controllers/membership.controller");
const { authJwt } = require("../middlewares");

const router = require("express").Router();

module.exports = (app) => {
  router.post("/create", controller.create);
  router.post("/createByPayment", controller.createByPayment);
  router.post("/getByUser", controller.find);
  router.post("/getByMe", controller.findMe);
  router.post("/toggle", [authJwt.isAdmin], controller.toggle);
  router.post("/delete", controller.deleteOne);
  app.use("/api/memberships", [authJwt.verifyToken], router);
};
