const controller = require("../controllers/setting.controller");
const { authJwt } = require("../middlewares");

const router = require("express").Router();

module.exports = (app) => {
  router.get(
    "/backup",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.backup
  );
  router.post(
    "/status",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getStatus
  );
  router.get("/theme/color", controller.getThemeColor);
  router.post(
    "/theme/color",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.setThemeColor
  );
  router.post(
    "/paypal",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.setPaypalOption
  );
  router.post("/paypal/get", [authJwt.verifyToken], controller.getPaypalOption);
  router.get("/intercom/get", controller.getIntercomOptions);
  router.post(
    "/intercom/save",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.setIntercomOptions
  );
  app.use("/api/setting", router);
};
