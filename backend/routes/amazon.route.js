const controller = require("../controllers/amazon.controller");
const { verifyMembership, authJwt } = require("../middlewares");
const router = require("express").Router();

module.exports = (app) => {
  router.post(
    "/products",
    [verifyMembership.checkMembership],
    controller.findAll
  );
  router.get(
    "/products/:id",
    [verifyMembership.checkMembership],
    controller.findOne
  );

  router.post(
    "/getCharts",
    [verifyMembership.checkMembership],
    controller.getCharts
  );

  app.use("/api/amazon", [authJwt.verifyToken], router);
};
