const controller = require("../controllers/ads.controller");
const { redis, verifyMembership, authJwt, db } = require("../middlewares");
const router = require('express').Router();


module.exports = app => {
    router.post("/", [verifyMembership.checkMembership, db.refresh], controller.findAll);
    router.get("/:id", [db.refresh], controller.findOne);
    app.use('/api/dd', [authJwt.verifyToken, redis], router);
};