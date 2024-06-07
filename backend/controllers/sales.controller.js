const db = require("../models");
const StoreProduct = db.storeproduct;
const TopProducts = db.topproduct;
const Product = db.products;
const TopStores = db.topstore;
const Membership = db.membership;

exports.findTopStores = async (req, res) => {
  const { params } = req.body;
  const queries = [];
  const matchStage = {};
  try {
    const expired = req.expired;
    const membership = req.membership;

    if (params.filters.q && params.filters.q != "") {
      matchStage.title = new RegExp(params.filters.q, "i")
    }


    if (params.filters.sales.max || params.filters.sales.min) {
      const salesFilter = {};
      if (params.filters.sales.max) {
        salesFilter.$lte = Number(params.filters.sales.max);
      }
      if (params.filters.sales.min) {
        salesFilter.$gte = Number(params.filters.sales.min);
      }
      matchStage.month_sales = salesFilter
    }

    if (params.filters.revenue.max || params.filters.revenue.min) {
      const revenueFilter = {};
      if (params.filters.revenue.max) {
        revenueFilter.$lte = Number(params.filters.revenue.max);
      }
      if (params.filters.revenue.min) {
        revenueFilter.$gte = Number(params.filters.revenue.min);
      }
      matchStage.month_revenue = revenueFilter;
    }

    if (params.filters.products.min || params.filters.products.max) {
      const productsFilter = {};
      if (params.filters.products.min) {
        productsFilter.$gte = Number(params.filters.products.min);
      }
      if (params.filters.products.max) {
        productsFilter.$lte = Number(params.filters.products.max);
      }
      matchStage.products_count = productsFilter;
    }


    if (params.filters.created_at.min || params.filters.created_at.max) {
      queries.push({
        $addFields: {
          createdDate: {
            $dateFromString: {
              dateString: "$created_at",
            },
          },
        },
      })
      const createdAtFilter = {};
      if (params.filters.created_at.min) {
        createdAtFilter.$gte = {
          $dateFromString: {
            dateString: params.filters.created_at.min,
          },
        };
      }
      if (params.filters.created_at.max) {
        createdAtFilter.$lte = {
          $dateFromString: {
            dateString: params.filters.created_at.max,
          },
        };
      }
      matchStage.$expr = createdAtFilter
    }

    if (
      params.filters.languages &&
      Array.isArray(params.filters.languages) &&
      params.filters.languages.length
    ) {
      matchStage.languages = {
        $in: params.filters.languages.map(
          (item) => new RegExp(item.code, "i")
        ),
      }
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

    if (Object.keys(matchStage).length > 0) {
      queries.push({ $match: matchStage });
    }

    queries.push({
      $sort: {
        _id: -1,
      }
    });


    queries.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: page_size }, {
          $lookup: {
            from: "chart2s", // The collection to join
            localField: "chart2", // Field from the input documents
            foreignField: "_id", // Field from the documents of the "from" collection
            as: "aggregations", // Output array field
          },
        }, {
          $unwind: "$aggregations"
        }],
      },
    });

    TopStores.aggregate(queries)
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
  const matchStage = {};
  try {
    const expired = req.expired;
    const membership = req.membership;

    if (params.filters.q && params.filters.q != "") {
      matchStage.title = new RegExp(params.filters.q, "i")
    }


    if (params.filters.sales.max || params.filters.sales.min) {
      const salesFilter = {};
      if (params.filters.sales.max) {
        salesFilter.$lte = Number(params.filters.sales.max);
      }
      if (params.filters.sales.min) {
        salesFilter.$gte = Number(params.filters.sales.min);
      }
      matchStage.month_sales = salesFilter;
    }

    if (params.filters.revenue.max || params.filters.revenue.min) {
      const revenueFilter = {};
      if (params.filters.revenue.max) {
        revenueFilter.$lte = Number(params.filters.revenue.max);
      }
      if (params.filters.revenue.min) {
        revenueFilter.$gte = Number(params.filters.revenue.min);
      }
      matchStage.month_revenue = revenueFilter;
    }

    if (params.filters.price.min || params.filters.price.max) {
      const priceFilter = {};
      if (params.filters.price.min) {
        priceFilter.$gte = Number(params.filters.price.min);
      }
      if (params.filters.price.max) {
        priceFilter.$lte = Number(params.filters.price.max);
      }
      matchStage.usd_price = priceFilter;
    }

    if (params.filters.created_at.min || params.filters.created_at.max)
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
      matchStage.$expr = {
        $gte: [
          "$createdDate",
          {
            $dateFromString: {
              dateString: params.filters.created_at.min,
            },
          },
        ],
      }

    if (params.filters.created_at.max)
      matchStage.$expr = {
        ...matchStage.$expr,
        $lte: [
          "$createdDate",
          {
            $dateFromString: {
              dateString: params.filters.created_at.max,
            },
          },
        ],
      }

    if (
      params.filters.languages &&
      Array.isArray(params.filters.languages) &&
      params.filters.languages.length > 0
    ) {
      matchStage["store.languages"] = {
        $in: params.filters.languages.map(
          (item) => new RegExp(item.code, "i")
        ),
      }
    }

    let skip = params.page_size * (params.page - 1) || 0;
    if (skip < 1) skip = 0;

    let page_size = params.page_size || 50;

    if (expired && req.role == "user") {
      skip = 0;
      page_size = 12;
    }


    if (Object.keys(matchStage).length > 0) {
      queries.push({ $match: matchStage });
    }

    queries.push({
      $sort: {
        _id: -1,
      }
    });

    // queries.push({
    //   $lookup: {
    //     from: "chart2s", // The collection to join
    //     localField: "chart2", // Field from the input documents
    //     foreignField: "_id", // Field from the documents of the "from" collection
    //     as: "aggregations", // Output array field
    //   },
    // })

    // queries.push({
    //   $unwind: "$aggregations"
    // })

    queries.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: page_size },
        {
          $lookup: {
            from: "chart2s", // The collection to join
            localField: "chart2", // Field from the input documents
            foreignField: "_id", // Field from the documents of the "from" collection
            as: "aggregations", // Output array field
          },
        }, { $unwind: "$aggregations" }
        ],
      },
    });

    TopProducts.aggregate(queries)
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
