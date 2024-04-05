const controller = require("../controllers/sales.controller");
const { verifyMembership, authJwt, db } = require("../middlewares");
const router = require("express").Router();

module.exports = (app) => {
  router.post(
    "/topstores",
    [verifyMembership.checkMembership],
    controller.findTopStores
  );
  router.post(
    "/topproducts",
    [verifyMembership.checkMembership],
    controller.findTopProducts
  );
  router.post(
    "/productsbystore",
    controller.findProductsByStore
  );
  app.use("/api/sales", [authJwt.verifyToken], router);
};
