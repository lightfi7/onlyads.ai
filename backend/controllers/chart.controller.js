const db = require("../models");
const fs = require("fs");
const Chart = db.charts;

exports.findOne = async (req, res) => {
  try {
    const chart = await Chart.findOne({ pid: req.params.id });
    if (!chart) {
      return res.status(500).send({
        code: 404,
        message: "Not found",
      });
    }
    res.send({
      code: 200,
      data: chart,
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      message: "Something went wrong!",
    });
  }
};
