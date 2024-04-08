const db = require("../models");
const Product = require("../models/amazon/product.model");
const Chart = require("../models/amazon/chart.model");

exports.findAll = async (req, res) => {
  try {
    let {
      page = 0,
      page_size = 50,
      q = "",
      categories = [],
      price = {
        min: null,
        max: null,
      },
      rank = "any",
    } = req.body;

    const expired = req.expired;
    const membership = req.membership;

    const queries = [];

    if (q && q != "") {
      queries.push({
        $match: {
          productName: new RegExp(q, "i"),
        },
      });
    }

    if (categories && Array.isArray(categories) && categories.length) {
      queries.push({
        $match: {
          productCategories: {
            $in: categories.map((item) => new RegExp(item, "i")),
          },
        },
      });
    }

    if (price.min) {
      queries.push({
        $match: {
          _productPrice: {
            $gte: Number(price.min),
          },
        },
      });
    }

    if (price.max) {
      queries.push({
        $match: {
          _productPrice: {
            $lte: Number(price.max),
          },
        },
      });
    }

    switch (rank) {
      case ">10":
        queries.push({
          $match: {
            _productOrdersRanking: {
              $lte: 10,
            },
          },
        });
        break;
      case ">100":
        queries.push({
          $match: {
            _productOrdersRanking: {
              $lte: 100,
            },
          },
        });
        break;
      case ">500":
        queries.push({
          $match: {
            _productOrdersRanking: {
              $lte: 500,
            },
          },
        });
        break;
      case ">1000":
        queries.push({
          $match: {
            _productOrdersRanking: {
              $lte: 1000,
            },
          },
        });
        break;
      case ">10000":
        queries.push({
          $match: {
            _productOrdersRanking: {
              $lte: 10000,
            },
          },
        });
        break;
      default:
        break;
    }

    page_size = Number(page_size) || 50;
    let skip = page_size * page;
    if (skip < 1) skip = 0;

    if (expired && req.role == "user") {
      skip = 0;
      perPage = 32;
    }

    queries.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: page_size }],
      },
    });

    Product.aggregate(queries)
      .then((products) => {
        res.send(products);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("!");
  }
};

exports.findOne = async (req, res) => {
  res.send(";)");
};

exports.getCharts = async (req, res) => {
  Chart.findOne({ productId: req.body.productId })
    .then((charts) => res.send(charts))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
