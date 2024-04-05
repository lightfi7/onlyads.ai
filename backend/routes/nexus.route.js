const controller = require("../controllers/nexus.controller");
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
  router.post(
    "/getTrends",
    [verifyMembership.checkMembership],
    controller.getTrends
  );
  router.post(
    "/getSuppliers",
    [verifyMembership.checkMembership],
    controller.getSuppliers
  );
  app.use("/api/nexus", [authJwt.verifyToken], router);
};
