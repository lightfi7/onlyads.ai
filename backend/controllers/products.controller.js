const db = require("../models");
const fs = require("fs");
const User = db.user;
const Product = db.products;
const Membership = db.membership;

exports.findAll = async (req, res) => {
  const { params } = req.body;
  const expired = req.expired;
  const membership = req.membership;

  const queries = [];

  const matchConditions = {};

  try {
    // Filtering
    if (params.filters.categories.length > 0) {

      matchConditions.category = {
        $in: params.filters.categories,
      }

    }

    if (params.filters.title) {
      const titleFilter = {};
      if (params.filters.title.include && Array.isArray(params.filters.title.include)) {
        titleFilter.$in = params.filters.title.include.map((item) => new RegExp(item, "i"));
      }
      if (params.filters.title.exclude && Array.isArray(params.filters.title.exclude)) {
        titleFilter.$not = { $in: params.filters.title.exclude.map((item) => new RegExp(item, "i")) };
      }
      if (Object.keys(titleFilter).length > 0) {
        matchConditions.title = titleFilter;
      }
    }

    if (params.filters.description) {
      const descriptionFilter = {};
      if (params.filters.description.include && Array.isArray(params.filters.description.include)) {
        descriptionFilter.$in = params.filters.description.include.map((item) => new RegExp(item, "i"));
      }
      if (params.filters.description.exclude && Array.isArray(params.filters.description.exclude)) {
        descriptionFilter.$not = { $in: params.filters.description.exclude.map((item) => new RegExp(item, "i")) };
      }
      if (Object.keys(descriptionFilter).length > 0) {
        matchConditions.handle = descriptionFilter;
      }
    }

    if (
      params.filters.domain.include &&
      Array.isArray(params.filters.domain.include)
    ) {
      queries.push({
        $match: {
          "store.custom_domain": {
            $in: params.filters.domain.include.map(
              (item) => new RegExp(item, "i")
            ),
          },
        },
      });
    }

    if (params.filters.domain) {
      const domainFilter = {};
      if (params.filters.domain.include && Array.isArray(params.filters.domain.include)) {
        domainFilter.$in = params.filters.domain.include.map((item) => new RegExp(item, "i"));
      }
      if (params.filters.domain.exclude && Array.isArray(params.filters.domain.exclude)) {
        domainFilter.$not = { $in: params.filters.domain.exclude.map((item) => new RegExp(item, "i")) };
      }
      if (Object.keys(domainFilter).length > 0) {
        matchConditions["store.custom_domain"] = domainFilter;
      }
    }

    if (params.filters.price) {
      if (params.filters.price.max) {
        matchConditions.usd_price = { ...matchConditions.usd_price, $lte: Number(params.filters.price.max) };
      }
      if (params.filters.price.min) {
        matchConditions.usd_price = { ...matchConditions.usd_price, $gte: Number(params.filters.price.min) };
      }
    }

    if (params.filters.sales.max)

      matchConditions.monthly_sales = {
        $lte: Number(params.filters.sales.max),
      }


    if (params.filters.sales.min)
      matchConditions.monthly_sales = {
        $gte: Number(params.filters.sales.min),
      }



    if (params.filters.revenue.max)
      matchConditions.monthly_revenue = {
        $lte: Number(params.filters.revenue.max),
      }

    if (params.filters.revenue.min)
      matchConditions.monthly_revenue = {
        $gte: Number(params.filters.revenue.min),
      }

    if (params.filters.products.max)
      matchConditions["store.products_count"] = {
        $lte: Number(params.filters.products.max),
      }

    if (params.filters.products.min)
      matchConditions["store.products_count"] = {
        $gte: Number(params.filters.products.min),
      }

    if (params.filters.images.max)
      matchConditions.images = {
        $lte: Number(params.filters.images.max),
      }

    if (params.filters.images.min)
      matchConditions.images = {
        $gte: Number(params.filters.images.min),
      }

    if (params.filters.variants.max)
      matchConditions.variants = {
        $lte: Number(params.filters.variants.max),
      }

    if (params.filters.variants.min)
      matchConditions.variants = {
        $gte: Number(params.filters.variants.min),
      }

    if (params.filters.product_created_at.min)
      matchConditions.$expr = {
        $gte: [
          "$created_at",
          {
            $dateFromString: {
              dateString: params.filters.product_created_at.min,
            },
          },
        ],
      }

    if (params.filters.product_created_at.max)
      matchConditions.$expr = {
        $lte: [
          "$created_at",
          {
            $dateFromString: {
              dateString: params.filters.product_created_at.max,
            },
          },
        ],
      }

    queries.push({
      $addFields: {
        storeCreatedAt: {
          $dateFromString: {
            dateString: "$store.created_at",
          },
        },
      },
    });

    if (params.filters.store_created_at.min)
      matchConditions.$expr = {
        $gte: [
          "$storeCreatedAt",
          {
            $dateFromString: {
              dateString: params.filters.store_created_at.min,
            },
          },
        ],
      }

    if (params.filters.store_created_at.max)
      matchConditions.$expr = {
        $lte: [
          "$storeCreatedAt",
          {
            $dateFromString: {
              dateString: params.filters.store_created_at.max,
            },
          },
        ],
      }

    if (params.filters.currency && Array.isArray(params.filters.currency))
      matchConditions["store.currency"] = { $in: params.filters.currency.map((c) => c.code) }

    if (params.filters.domain_tld && Array.isArray(params.filters.domain_tld)) {
      const tlds = params.filters.domain_tld
        .map((t) => t.value.replace(/\./g, ""))
        .join("|");
      const pattern = new RegExp(`^.*\\.(${tlds})$`);
      matchConditions["store.custom_domain"] = {
        $regex: pattern,
      }
    }
    queries.push({$match: matchConditions});
    queries.push(
      {
        $project: {
          _id: 0,
          id: "$id",
          main_image: "$main_image",
          name: '$name',
          title: "$title",
          handle: "$handle",
          usd_price: "$usd_price",
          monthly_sales: "$monthly_sales",
          monthly_revenue: "$monthly_revenue",
          original_price: '$original_price',
          original_price_max: '$original_price_max',
          usd_price_max: '$usd_price_max',
          monthly_sales: '$monthly_sales',
          store: '$store',

        }
      }
    )

    // Sorting
    // let sort = params.ordering;

    // if (Array.isArray(sort)) sort = {};

    // if (Object.keys(sort).length > 0)
    //   queries.push({
    //     $sort: sort,
    //   });
    // else
    //   queries.push({
    //     $sort: {
    //       created_at: -1,
    //     },
    //   });

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

    Product.aggregate(queries)
      // .allowDiskUse(true)
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
    res.status(500).send({
      code: 500,
      message: "Something went wrong!",
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(500).send({
        code: 404,
        message: "Not found",
      });
    }
    res.send({
      code: 200,
      data: product,
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      message: "Something went wrong!",
    });
  }
};
