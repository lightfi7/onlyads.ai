const controller = require("../controllers/chart.controller");
const { authJwt } = require("../middlewares");
const router = require("express").Router();

module.exports = (app) => {
  router.get("/:id", controller.findOne);
  app.use("/api/chart", [authJwt.verifyToken], router);
};
