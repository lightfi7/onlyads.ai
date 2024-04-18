const db = require("../models");
const StoreProduct = db.storeproduct;
const TopProducts = db.topproduct;
const Product = db.products;
const TopStores = db.topstore;
const Membership = db.membership;

exports.findTopStores = async (req, res) => {
  const { params } = req.body;
  const queries = [];
  try {
    const expired = req.expired;
    const membership = req.membership;

    if (params.filters.q && params.filters.q != "") {
      queries.push({
        $match: {
          title: new RegExp(params.filters.q, "i"),
        },
      });
    }

    if (params.filters.sales.max)
      queries.push({
        $match: {
          monthly_sales: {
            $lte: Number(params.filters.sales.max),
          },
        },
      });

    if (params.filters.sales.min)
      queries.push({
        $match: {
          monthly_sales: {
            $gte: Number(params.filters.sales.min),
          },
        },
      });

    if (params.filters.revenue.max)
      queries.push({
        $match: {
          monthly_revenue: {
            $lte: Number(params.filters.revenue.max),
          },
        },
      });

    if (params.filters.revenue.min)
      queries.push({
        $match: {
          monthly_revenue: {
            $gte: Number(params.filters.revenue.min),
          },
        },
      });

    if (params.filters.products.min)
      queries.push({
        $match: {
          products_count: {
            $gte: Number(params.filters.products.min),
          },
        },
      });

    if (params.filters.products.max)
      queries.push({
        $match: {
          products_count: {
            $lte: Number(params.filters.products.max),
          },
        },
      });

    queries.push({
      $addFields: {
        createdDate: {
          $dateFromString: {
            dateString: "$created_at",
          },
        },
      },
    });

    if (params.filters.created_at.min)
      queries.push({
        $match: {
          $expr: {
            $gte: [
              "$createdDate",
              {
                $dateFromString: {
                  dateString: params.filters.created_at.min,
                },
              },
            ],
          },
        },
      });

    if (params.filters.created_at.max)
      queries.push({
        $match: {
          $expr: {
            $lte: [
              "$createdDate",
              {
                $dateFromString: {
                  dateString: params.filters.created_at.max,
                },
              },
            ],
          },
        },
      });

    if (
      params.filters.languages &&
      Array.isArray(params.filters.languages) &&
      params.filters.languages.length
    ) {
      queries.push({
        $match: {
          languages: {
            $in: params.filters.languages.map(
              (item) => new RegExp(item.code, "i")
            ),
          },
        },
      });
    }

    // queries.push({
    //   $sort: {
    //     createdDate: -1,
    //   },
    // });

    let skip = params.page_size * (params.page - 1) || 0;
    if (skip < 1) skip = 0;

    let page_size = params.page_size || 50;

    if (expired && req.role == "user") {
      skip = 0;
      page_size = 12;
    }

    queries.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: page_size }],
      },
    });
    TopStores.aggregate(queries)
      .sort({
        _id: -1,
      })
      .allowDiskUse(true)
      .then((data) => {
        let total = 0;
        if (data[0].metadata.length) total = data[0].metadata[0].total;
        if (req.role == "user") {
          // switch (membership?.type) {
          //   case "Basic":
          //     total = total > 200 ? 200 : total;
          //     break;
          //   case "Standard":
          //     total = total > 2000 ? 2000 : total;
          //     break;
          //   case "Enterprise":
          //     total = total > 5000 ? 5000 : total;
          //     break;
          //   default:
          //     break;
          // }
        }
        res.status(200).send([
          {
            metadata: [
              {
                total,
              },
            ],
            data: data[0].data,
          },
        ]);
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Faild to fetch top stores!");
  }
};

exports.findTopProducts = async (req, res) => {
  const { params } = req.body;
  const queries = [];
  try {
    const expired = req.expired;
    const membership = req.membership;

    if (params.filters.q && params.filters.q != "") {
      queries.push({
        $match: {
          title: new RegExp(params.filters.q, "i"),
        },
      });
    }

    if (params.filters.sales.max)
      queries.push({
        $match: {
          monthly_sales: {
            $lte: Number(params.filters.sales.max),
          },
        },
      });

    if (params.filters.sales.min)
      queries.push({
        $match: {
          monthly_sales: {
            $gte: Number(params.filters.sales.min),
          },
        },
      });

    if (params.filters.revenue.max)
      queries.push({
        $match: {
          monthly_revenue: {
            $lte: Number(params.filters.revenue.max),
          },
        },
      });

    if (params.filters.revenue.min)
      queries.push({
        $match: {
          monthly_revenue: {
            $gte: Number(params.filters.revenue.min),
          },
        },
      });

    if (params.filters.price.min)
      queries.push({
        $match: {
          usd_price: {
            $gte: Number(params.filters.price.min),
          },
        },
      });

    if (params.filters.price.max)
      queries.push({
        $match: {
          usd_price: {
            $lte: Number(params.filters.price.max),
          },
        },
      });

    queries.push({
      $addFields: {
        createdDate: {
          $dateFromString: {
            dateString: "$created_at",
          },
        },
      },
    });

    if (params.filters.created_at.min)
      queries.push({
        $match: {
          $expr: {
            $gte: [
              "$createdDate",
              {
                $dateFromString: {
                  dateString: params.filters.created_at.min,
                },
              },
            ],
          },
        },
      });

    if (params.filters.created_at.max)
      queries.push({
        $match: {
          $expr: {
            $lte: [
              "$createdDate",
              {
                $dateFromString: {
                  dateString: params.filters.created_at.max,
                },
              },
            ],
          },
        },
      });

    if (
      params.filters.languages &&
      Array.isArray(params.filters.languages) &&
      params.filters.languages.length > 0
    ) {
      queries.push({
        $match: {
          "store.languages": {
            $in: params.filters.languages.map(
              (item) => new RegExp(item.code, "i")
            ),
          },
        },
      });
    }

    // queries.push({
    //   $sort: {
    //     createdDate: -1,
    //   },
    // });

    let skip = params.page_size * (params.page - 1) || 0;
    if (skip < 1) skip = 0;

    let page_size = params.page_size || 50;

    if (expired && req.role == "user") {
      skip = 0;
      page_size = 12;
    }

    queries.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: page_size }],
      },
    });

    TopProducts.aggregate(queries)
      .sort({
        _id: -1,
      })
      .allowDiskUse(true)
      .then((data) => {
        let total = 0;
        if (data[0].metadata.length) total = data[0].metadata[0].total;
        if (req.role == "user") {
          // switch (membership?.type) {
          //   case "Basic":
          //     total = total > 200 ? 200 : total;
          //     break;
          //   case "Standard":
          //     total = total > 2000 ? 2000 : total;
          //     break;
          //   case "Enterprise":
          //     total = total > 5000 ? 5000 : total;
          //     break;
          //   default:
          //     break;
          // }
        }
        res.status(200).send([
          {
            metadata: [
              {
                total,
              },
            ],
            data: data[0].data,
          },
        ]);
      });
  } catch (err) {
    console.log(err);
    res.status(500).send("Faild to fetch top products!");
  }
};

exports.findProductsByStore = async (req, res) => {
  const { storeId, page_num, page_count, sort } = req.body;
  const queries = [];
  const skip = page_num * page_count;
  queries.push({
    $match: {
      storeId: storeId,
    },
  });

  queries.push({
    $addFields: {
      createdDate: { $toDate: "$created_at" },
    },
  });

  // Sorting
  if (Array.isArray(sort)) sort = {};

  if (Object.keys(sort).length > 0)
    queries.push({
      $sort: sort,
    });
  else
    queries.push({
      $sort: {
        createdDate: -1,
      },
    });

  queries.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: skip }, { $limit: page_count }],
    },
  });

  StoreProduct.aggregate(queries)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Faild to fetch products by store!");
    });
};
