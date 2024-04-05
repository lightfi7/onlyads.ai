const controller = require("../controllers/invoice.controller");
const { authJwt } = require("../middlewares");
const router = require("express").Router();

module.exports = (app) => {
  router.post("/getByUser", controller.find);
  router.get("/getByMe", controller.findMe);
  app.use("/api/invoices", [authJwt.verifyToken], router);
};
