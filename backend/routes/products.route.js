const controller = require("../controllers/products.controller");
const { verifyMembership, authJwt, db } = require("../middlewares");
const router = require("express").Router();

module.exports = (app) => {
  router.post("/", [verifyMembership.checkMembership], controller.findAll);
  router.get("/:id", [db.refresh], controller.findOne);
  app.use("/api/products", [authJwt.verifyToken], router);
};
