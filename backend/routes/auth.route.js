const { verifySignUp, authJwt, verifyMembership } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/register",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/login", controller.signin);
  app.post("/api/me", [authJwt.verifyToken, verifyMembership.checkMembership], controller.me);
  app.post("/api/profile", [authJwt.verifyToken], controller.profile);
  app.post(
    "/api/profile/update",
    [authJwt.verifyToken],
    upload.single("avatar"),
    controller.updateProfile
  );
  app.post("/api/reset-password", controller.resetPassword);
  app.post("/api/forgot-password", controller.forgotPassword);
};
