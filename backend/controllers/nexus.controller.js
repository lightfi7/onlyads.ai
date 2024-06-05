const db = require("../models");
const Chart = require("../models/nexus/chart.model");
const Supplier = require("../models/nexus/supplier.model");
const Trend = require("../models/nexus/trend.model");
const NexusProduct = db.nexus_product;

// exports.findAll = async (req, res) => {
//   try {
//     let {
//       page = 0,
//       page_size = 50,
//       q = "",
//       ship_from = [],
//       categories = [],
//       price = {
//         min: null,
//         max: null,
//       },
//       orders = {
//         min: null,
//         max: null,
//       },
//       store_selling = {
//         min: null,
//         max: null,
//       },
//       field = "all",
//     } = req.body;

//     const expired = req.expired;
//     const membership = req.membership;

//     const queries = [];

//     if (q && q != "") {
//       queries.push({
//         $match: {
//           productName: new RegExp(q, "i"),
//         },
//       });
//     }

//     switch (field) {
//       case "all":
//         break;
//       case "trend":
//         queries.push({
//           $match: {
//             trend: true,
//           },
//         });
//         break;
//       case "rise":
//         queries.push({
//           $match: {
//             rise: true,
//           },
//         });
//         break;
//       case "hot":
//         queries.push({
//           $match: {
//             hot: true,
//           },
//         });
//         break;
//       case "new":
//         queries.push({
//           $match: {
//             new: true,
//           },
//         });
//         break;
//     }

//     if (ship_from && Array.isArray(ship_from) && ship_from.length) {
//       queries.push({
//         $match: {
//           productShips: {
//             $in: ship_from.map((item) => new RegExp(item, "i")),
//           },
//         },
//       });
//     }

//     if (categories && Array.isArray(categories) && categories.length) {
//       queries.push({
//         $match: {
//           productCategories: {
//             $in: categories.map((item) => new RegExp(item, "i")),
//           },
//         },
//       });
//     }

//     if (price.min) {
//       queries.push({
//         $match: {
//           _productPrice: {
//             $gte: Number(price.min),
//           },
//         },
//       });
//     }

//     if (price.max) {
//       queries.push({
//         $match: {
//           _productPrice: {
//             $lte: Number(price.max),
//           },
//         },
//       });
//     }

//     if (orders.min) {
//       queries.push({
//         $match: {
//           productOrders: {
//             $gte: Number(orders.min),
//           },
//         },
//       });
//     }

//     if (orders.max) {
//       queries.push({
//         $match: {
//           productOrders: {
//             $lte: Number(orders.max),
//           },
//         },
//       });
//     }

//     if (store_selling.min) {
//       queries.push({
//         $match: {
//           productStoreSellingCount: {
//             $gte: Number(store_selling.min),
//           },
//         },
//       });
//     }

//     if (store_selling.max) {
//       queries.push({
//         $match: {
//           productStoreSellingCount: {
//             $lte: Number(store_selling.max),
//           },
//         },
//       });
//     }

//     page_size = Number(page_size) || 50;
//     let skip = page_size * page;
//     if (skip < 1) skip = 0;

//     if (expired && req.role == "user") {
//       skip = 0;
//       perPage = 32;
//     }

//     queries.push({
//       $sort: {
//         _id: -1,
//       },
//     });

//     queries.push({
//       $facet: {
//         metadata: [{ $count: "total" }],
//         data: [{ $skip: skip }, { $limit: page_size }],
//       },
//     });

//     NexusProduct.aggregate(queries)
//       .then((products) => {
//         res.send(products);
//       })
//       .catch((err) => {
//         console.log(err);
//         res.status(500).send(err);
//       });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("!");
//   }
// };


exports.findAll = async (req, res) => {
  try {
    let {
      page = 0,
      page_size = 50,
      q = "",
      ship_from = [],
      categories = [],
      price = { min: null, max: null },
      orders = { min: null, max: null },
      store_selling = { min: null, max: null },
      field = "all",
    } = req.body;

    const expired = req.expired;
    const membership = req.membership;

    // Build the $match stage with all conditions
    const match = {};

    if (q && q != "") {
      match.productName = new RegExp(q, "i");
    }

    switch (field) {
      case "trend":
        match.trend = true;
        break;
      case "rise":
        match.rise = true;
        break;
      case "hot":
        match.hot = true;
        break;
      case "new":
        match.new = true;
        break;
    }

    if (ship_from && Array.isArray(ship_from) && ship_from.length) {
      match.productShips = { $in: ship_from.map((item) => new RegExp(item, "i")) };
    }

    if (categories && Array.isArray(categories) && categories.length) {
      match.productCategories = { $in: categories.map((item) => new RegExp(item, "i")) };
    }

    if (price.min) {
      match._productPrice = { $gte: Number(price.min) };
    }

    if (price.max) {
      match._productPrice = { $lte: Number(price.max) };
    }

    if (orders.min) {
      match.productOrders = { $gte: Number(orders.min) };
    }

    if (orders.max) {
      match.productOrders = { $lte: Number(orders.max) };
    }

    if (store_selling.min) {
      match.productStoreSellingCount = { $gte: Number(store_selling.min) };
    }

    if (store_selling.max) {
      match.productStoreSellingCount = { $lte: Number(store_selling.max) };
    }

    page_size = Number(page_size) || 50;
    let skip = page_size * page;
    if (skip < 1) skip = 0;

    if (expired && req.role == "user") {
      skip = 0;
      perPage = 32;
    }

    // Combine all stages into a single aggregate pipeline
    const pipeline = [
      { $match: match }, // Apply all filters at once
      { $sort: { _id: -1 } }, // Sort before pagination
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: page_size }],
        },
      },
    ];

    NexusProduct.aggregate(pipeline)
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

exports.getTrends = async (req, res) => {
  Trend.findOne({ productId: req.body.productId })
    .then((trends) => res.send(trends))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

exports.getSuppliers = async (req, res) => {
  Supplier.findOne({ productId: req.body.productId })
    .then((suppliers) =>
      res.send(
        suppliers
          ? suppliers
          : {
            _id: "660ecbb61619dc561630cd1c",
            productId: "o8iiKvYaJnUYU4a1lu6NNCifxHWPLKNc",
            choosen_shipping_method: "CAINIAO_STANDARD",
            choosen_shipping_method_mandatory: false,
            matchingProducts: [],
            matchingProducts_count: 0,
            products: [
              {
                productId: "3256805715071544",
                title:
                  "ROIDMI MiroHair Dryer for Household Hair Salons, Dedicated To High-power Fast Dry Cooling Hot Air Hairstylist's Air Duct",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S0d032b5c789c415ab463542327e4e36a0.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "122.39",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 16.79,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$122.39",
                freightAmount_Converted: "$16.79",
                buttons_data: "3256805715071544,0",
              },
              {
                productId: "3256805715071544",
                title:
                  "ROIDMI MiroHair Dryer for Household Hair Salons, Dedicated To High-power Fast Dry Cooling Hot Air Hairstylist's Air Duct",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S0d032b5c789c415ab463542327e4e36a0.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "122.39",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 23.91,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$122.39",
                freightAmount_Converted: "$23.91",
                buttons_data: "3256805715071544,0",
              },
              {
                productId: "3256805940769302",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sfd8ab3ea9dfc4db2be3431d951a24e748.jpg",
                totalOrders: "12",
                averageRating: "",
                productMinPrice: {
                  value: "86.23",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 31.98,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$86.23",
                freightAmount_Converted: "$31.98",
                buttons_data: "3256805940769302,0",
              },
              {
                productId: "3256805940769302",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sfd8ab3ea9dfc4db2be3431d951a24e748.jpg",
                totalOrders: "12",
                averageRating: "",
                productMinPrice: {
                  value: "86.23",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 39.62,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$86.23",
                freightAmount_Converted: "$39.62",
                buttons_data: "3256805940769302,0",
              },
              {
                productId: "3256805940769302",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sfd8ab3ea9dfc4db2be3431d951a24e748.jpg",
                totalOrders: "12",
                averageRating: "",
                productMinPrice: {
                  value: "86.23",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 43.97,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$86.23",
                freightAmount_Converted: "$43.97",
                buttons_data: "3256805940769302,0",
              },
              {
                productId: "3256805940769302",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sfd8ab3ea9dfc4db2be3431d951a24e748.jpg",
                totalOrders: "12",
                averageRating: "",
                productMinPrice: {
                  value: "86.23",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 44.38,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$86.23",
                freightAmount_Converted: "$44.38",
                buttons_data: "3256805940769302,0",
              },
              {
                productId: "3256805940769302",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sfd8ab3ea9dfc4db2be3431d951a24e748.jpg",
                totalOrders: "12",
                averageRating: "",
                productMinPrice: {
                  value: "86.23",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 49.44,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$86.23",
                freightAmount_Converted: "$49.44",
                buttons_data: "3256805940769302,0",
              },
              {
                productId: "3256805940769302",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sfd8ab3ea9dfc4db2be3431d951a24e748.jpg",
                totalOrders: "12",
                averageRating: "",
                productMinPrice: {
                  value: "86.23",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 76.21,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$86.23",
                freightAmount_Converted: "$76.21",
                buttons_data: "3256805940769302,0",
              },
              {
                productId: "3256805628890143",
                title:
                  "110000RPM Professional Hair Dryer Brushless Negative Ions Blow Dryer Super Powerful Wind Lownoise Salon 1600W Electric Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S8652cfd8041646859eaca16525aec824P.jpg",
                totalOrders: "82",
                averageRating: "",
                productMinPrice: {
                  value: "94.26",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$94.26",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256805628890143,0",
              },
              {
                productId: "3256806119638301",
                title:
                  "XIAOMI MIJIA H701 Hair Dryers High Speed Water Ion Professional Hair Care Quick Dry Negative Ion 65m/s 110000Rpm 220V CN Version",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S7268db82f3c84e7fb0f1a3e2d5d3ecbfA.jpg",
                totalOrders: "375",
                averageRating: "",
                productMinPrice: {
                  value: "99.24",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$99.24",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256806119638301,0",
              },
              {
                productId: "3256806195287953",
                title:
                  "Mi High Speed Hair Dryer Negative Ion Hair Care 110000 Rpm Constant Temperature And Quick Drying Low Noise Blow Dryer For Home",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sb7c9c26a395d45558028216c84704fb7w.jpg",
                totalOrders: "4",
                averageRating: "",
                productMinPrice: {
                  value: "49.25",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$49.25",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256806195287953,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 25.2,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$25.20",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "CAINIAO_STANDARD_SG_AIR",
                companyDisplayName: "Cainiao Standard - SG Air",
                deliveryDate: "18",
                deliveryDateFormat: "18 Days",
                freightAmount: {
                  value: 28.29,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$28.29",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 31.07,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$31.07",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 31.35,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$31.35",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 35.27,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$35.27",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 37.04,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$37.04",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805940877371",
                title:
                  "110000 RPM ROIDMI Hair Dryer A100 Portable Anion 1000W Hairdryer Water Ion Hair Care Home Appliance Water Ion Hair Care",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S751fc1a4f903460a874ff63faba28be5G.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.18",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 40.12,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.18",
                freightAmount_Converted: "$40.12",
                buttons_data: "3256805940877371,0",
              },
              {
                productId: "3256805828107186",
                title:
                  "XIAOMI MIJIA Hair Dryer H501 SE High Speed Negative Ions Wind Speed 62m/s 1600W 110000 Rpm Professional Hair Care Quick Drye",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd2ec84d21bdf4ac4a9c840bfc82425670.jpg",
                totalOrders: "53",
                averageRating: "",
                productMinPrice: {
                  value: "42.62",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$42.62",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256805828107186,0",
              },
              {
                productId: "3256805930955920",
                title:
                  "XIAOMI MIJIA  H501 SE High Speed Hair Dryer 62m/s Wind Speed Negative Ion Hair Care 110,000 Rpm Professional Dry 220V CN Version",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S50fcab352ebe4861823f181b29ae25a0F.jpg",
                totalOrders: "1204",
                averageRating: "",
                productMinPrice: {
                  value: "35.37",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$35.37",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256805930955920,0",
              },
              {
                productId: "3256806207751856",
                title:
                  "XIAOMI MIJIA High Speed Hair Dryer H501 SE 62m/s Wind Speed Negative Ion Hair Care 110 000 Rpm Professional Dry 220V CN Version",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sccf4507e5da14dcbacda4bd068b8c1e4K.jpg",
                totalOrders: "977",
                averageRating: "",
                productMinPrice: {
                  value: "36.12",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$36.12",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256806207751856,0",
              },
              {
                productId: "3256805884223583",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed 65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se0960b86e8c143b992214ec1c3c195a3L.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "78.27",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 39.27,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$78.27",
                freightAmount_Converted: "$39.27",
                buttons_data: "3256805884223583,0",
              },
              {
                productId: "3256805884223583",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed 65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se0960b86e8c143b992214ec1c3c195a3L.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "78.27",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 44.38,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$78.27",
                freightAmount_Converted: "$44.38",
                buttons_data: "3256805884223583,0",
              },
              {
                productId: "3256805884223583",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed 65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se0960b86e8c143b992214ec1c3c195a3L.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "78.27",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 65.7,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$78.27",
                freightAmount_Converted: "$65.70",
                buttons_data: "3256805884223583,0",
              },
              {
                productId: "3256805884223583",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed 65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se0960b86e8c143b992214ec1c3c195a3L.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "78.27",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 73,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$78.27",
                freightAmount_Converted: "$73.00",
                buttons_data: "3256805884223583,0",
              },
              {
                productId: "3256805884223583",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed 65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se0960b86e8c143b992214ec1c3c195a3L.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "78.27",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 76.21,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$78.27",
                freightAmount_Converted: "$76.21",
                buttons_data: "3256805884223583,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 25.77,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$25.77",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "EMS",
                companyDisplayName: "EMS",
                deliveryDate: "13",
                deliveryDateFormat: "13 Days",
                freightAmount: {
                  value: 28.47,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$28.47",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "FEDEX_IE",
                companyDisplayName: "Fedex IE",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 33.82,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$33.82",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 41.78,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$41.78",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 42.01,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$42.01",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 42.09,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$42.09",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 42.3,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$42.30",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805762531256",
                title:
                  "ROIDMI Miro Hair dryer Affordable High speed  65m/s Rapid Air Flow Low Noise Smart Temperature Control 20 Million Negative Ions",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sd0ead8cab4074e1bb38fcb632c05c895A.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "103.17",
                },
                company: "E_EMS",
                companyDisplayName: "e-EMS",
                deliveryDate: "61",
                deliveryDateFormat: "61 Days",
                freightAmount: {
                  value: 56.94,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$103.17",
                freightAmount_Converted: "$56.94",
                buttons_data: "3256805762531256,0",
              },
              {
                productId: "3256805931384334",
                title:
                  "XIAOMI MIJIA High Speed Hair Dryer H701 Water Ion 65m/s Wind Speed 220V Professional Hair Care Quick Drye Negative lon HairDryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S42d5d40001cb447fb35fb43084e972f5C.jpg",
                totalOrders: "84",
                averageRating: "",
                productMinPrice: {
                  value: "83.00",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$83.00",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256805931384334,0",
              },
              {
                productId: "3256806327249141",
                title:
                  "Haier High Speed Hair Dryer Household High Power Wind Anion Practical Low Noise F6 Quick Dry Hair Care Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sba7f8f9575ef438dbad0f9ba42c11f93Z.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "59.56",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$59.56",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256806327249141,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 22.46,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$22.46",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "CAINIAO_STANDARD_SG_AIR",
                companyDisplayName: "Cainiao Standard - SG Air",
                deliveryDate: "18",
                deliveryDateFormat: "18 Days",
                freightAmount: {
                  value: 25.2,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$25.20",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 27.78,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$27.78",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 32,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$32.00",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "FEDEX_IE",
                companyDisplayName: "Fedex IE",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 32.57,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$32.57",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 35.63,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$35.63",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256805940716891",
                title:
                  "2023 New ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S406af025abdb4f579d053ab9396c2ba7T.jpg",
                totalOrders: "8",
                averageRating: "",
                productMinPrice: {
                  value: "85.00",
                },
                company: "EMS",
                companyDisplayName: "EMS",
                deliveryDate: "13",
                deliveryDateFormat: "13 Days",
                freightAmount: {
                  value: 45.68,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$85.00",
                freightAmount_Converted: "$45.68",
                buttons_data: "3256805940716891,0",
              },
              {
                productId: "3256806432949214",
                title:
                  "XIAOMI MIJIA High Speed Hair Dryer H501 Negative Ion Hair Care 110000 Rpm Dry 220V CN Version (With EU Adapter) 62m/s wind speed",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S3de4329f2f0044f1906e1b0d679f48aan.jpg",
                totalOrders: "1959",
                averageRating: "",
                productMinPrice: {
                  value: "47.88",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$47.88",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256806432949214,0",
              },
              {
                productId: "3256806164765114",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S83b18d7eaf1c43ec903aacb26ec4c126w.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "172.94",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 40.61,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$172.94",
                freightAmount_Converted: "$40.61",
                buttons_data: "3256806164765114,0",
              },
              {
                productId: "3256806164765114",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S83b18d7eaf1c43ec903aacb26ec4c126w.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "172.94",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 42.65,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$172.94",
                freightAmount_Converted: "$42.65",
                buttons_data: "3256806164765114,0",
              },
              {
                productId: "3256806164765114",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S83b18d7eaf1c43ec903aacb26ec4c126w.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "172.94",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 44.38,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$172.94",
                freightAmount_Converted: "$44.38",
                buttons_data: "3256806164765114,0",
              },
              {
                productId: "3256806164765114",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S83b18d7eaf1c43ec903aacb26ec4c126w.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "172.94",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 54.79,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$172.94",
                freightAmount_Converted: "$54.79",
                buttons_data: "3256806164765114,0",
              },
              {
                productId: "3256806164765114",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S83b18d7eaf1c43ec903aacb26ec4c126w.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "172.94",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 55.96,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$172.94",
                freightAmount_Converted: "$55.96",
                buttons_data: "3256806164765114,0",
              },
              {
                productId: "3256806164765114",
                title: "ROIDMI Miro Hair Dryer, Negative Ionic Blow Dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S83b18d7eaf1c43ec903aacb26ec4c126w.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "172.94",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 76.21,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$172.94",
                freightAmount_Converted: "$76.21",
                buttons_data: "3256806164765114,0",
              },
              {
                productId: "3256806077129761",
                title:
                  "High Speed Anion 110000rpm Hair Dryer Wind 62m/s 1600W 2 Minute Quick Dry Professional Hair Care Negative Lon",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S99afd8c969ce41f685b22d87b93b0a19L.jpg",
                totalOrders: "1200",
                averageRating: "",
                productMinPrice: {
                  value: "34.96",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$34.96",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256806077129761,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "EMS",
                companyDisplayName: "EMS",
                deliveryDate: "13",
                deliveryDateFormat: "13 Days",
                freightAmount: {
                  value: 58.74,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$58.74",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "E_EMS",
                companyDisplayName: "e-EMS",
                deliveryDate: "61",
                deliveryDateFormat: "61 Days",
                freightAmount: {
                  value: 58.74,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$58.74",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 86.2,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$86.20",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 86.67,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$86.67",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 86.84,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$86.84",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805014408271",
                title:
                  "Hair Dryer High Speed 23m/s Air Speed Quick Dry Negative Ion Blow Dryer Professional Hair Care 110,000rpm Motor 59dB",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S281a7762a45b45ed85cbe328e4116fdc8.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "109.12",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 87.27,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$109.12",
                freightAmount_Converted: "$87.27",
                buttons_data: "3256805014408271,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 25.27,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$25.27",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "EMS",
                companyDisplayName: "EMS",
                deliveryDate: "13",
                deliveryDateFormat: "13 Days",
                freightAmount: {
                  value: 42.17,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$42.17",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "E_EMS",
                companyDisplayName: "e-EMS",
                deliveryDate: "61",
                deliveryDateFormat: "61 Days",
                freightAmount: {
                  value: 42.17,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$42.17",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "FEDEX_IE",
                companyDisplayName: "Fedex IE",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 62.03,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$62.03",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 77.05,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$77.05",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 77.19,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$77.19",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256805980843653",
                title:
                  "Hair Straighteners Car Dryer Machine Professional Cutting Home-appliance Clipper Blow Drier Electric Brush Chaisson Mini Blower",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Se4333fe2231e411b93a1cefd855963836.jpg",
                totalOrders: "1",
                averageRating: "",
                productMinPrice: {
                  value: "106.86",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 77.57,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$106.86",
                freightAmount_Converted: "$77.57",
                buttons_data: "3256805980843653,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "CAINIAO_STANDARD_SG_AIR",
                companyDisplayName: "Cainiao Standard - SG Air",
                deliveryDate: "18",
                deliveryDateFormat: "18 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "CPAP",
                companyDisplayName: "China Post Air Parcel",
                deliveryDate: "47",
                deliveryDateFormat: "47 Days",
                freightAmount: {
                  value: 37.01,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$37.01",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "EMS",
                companyDisplayName: "EMS",
                deliveryDate: "13",
                deliveryDateFormat: "13 Days",
                freightAmount: {
                  value: 40.73,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$40.73",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 54.62,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$54.62",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "E_EMS",
                companyDisplayName: "e-EMS",
                deliveryDate: "61",
                deliveryDateFormat: "61 Days",
                freightAmount: {
                  value: 67.89,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$67.89",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
                deliveryDate: "10",
                deliveryDateFormat: "10 Days",
                freightAmount: {
                  value: 74.23,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$74.23",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "FEDEX_IE",
                companyDisplayName: "Fedex IE",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 74.87,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$74.87",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 99.54,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$99.54",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "DHL",
                companyDisplayName: "DHL",
                deliveryDate: "11",
                deliveryDateFormat: "11 Days",
                freightAmount: {
                  value: 99.58,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$99.58",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256806060033118",
                title:
                  "SE high-speed hair dryer household low-noise negative ion hair care professional quick-drying hair dryer",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S89a14630eb2749a48fa3a6d628c689a0Q.jpg",
                totalOrders: "2",
                averageRating: "",
                productMinPrice: {
                  value: "131.82",
                },
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
                deliveryDate: "8",
                deliveryDateFormat: "8 Days",
                freightAmount: {
                  value: 99.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$131.82",
                freightAmount_Converted: "$99.99",
                buttons_data: "3256806060033118,0",
              },
              {
                productId: "3256805892659022",
                title:
                  "NEW XIAOMI MIJIA High Speed Negative Ion Hair Dryers H501 SE Professional Hair Care Quick Drye 1600W 110000 Rpm Wind Speed 62m/s",
                imageUrl:
                  "https://ae01.alicdn.com/kf/S9c52aef60b924e70a53d0211ff41c5d4e.jpg",
                totalOrders: "0",
                averageRating: "",
                productMinPrice: {
                  value: "74.78",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 0,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$74.78",
                freightAmount_Converted: "$0.00",
                buttons_data: "3256805892659022,0",
              },
              {
                productId: "3256805947912410",
                title:
                  "ROIDMI Miro High-speed, 65m/s Fast Airflow, Low Noise, Intelligent Temperature Control, 20 Million Negative Ions2023, Novo",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sf7240d22a9d24ea58c38eab4574d6be8h.jpg",
                totalOrders: "4",
                averageRating: "",
                productMinPrice: {
                  value: "87.52",
                },
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                deliveryDate: "16",
                deliveryDateFormat: "16 Days",
                freightAmount: {
                  value: 21,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$87.52",
                freightAmount_Converted: "$21.00",
                buttons_data: "3256805947912410,0",
              },
              {
                productId: "3256805947912410",
                title:
                  "ROIDMI Miro High-speed, 65m/s Fast Airflow, Low Noise, Intelligent Temperature Control, 20 Million Negative Ions2023, Novo",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sf7240d22a9d24ea58c38eab4574d6be8h.jpg",
                totalOrders: "4",
                averageRating: "",
                productMinPrice: {
                  value: "87.52",
                },
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
                deliveryDate: "15",
                deliveryDateFormat: "15 Days",
                freightAmount: {
                  value: 23.29,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$87.52",
                freightAmount_Converted: "$23.29",
                buttons_data: "3256805947912410,0",
              },
              {
                productId: "3256805870544221",
                title:
                  "Xiaomi Mijia Electric Hair Dryer H501 High Speed Negative Ions 110,000 Rpm Professional Care Wind Speed 62m/s 1600W Quick Dry",
                imageUrl:
                  "https://ae01.alicdn.com/kf/Sebab75a671da4fbfb297e43da35434841.jpg",
                totalOrders: "963",
                averageRating: "",
                productMinPrice: {
                  value: "51.17",
                },
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
                deliveryDate: "12",
                deliveryDateFormat: "12 Days",
                freightAmount: {
                  value: 1.99,
                },
                hasTrends: 0,
                productMinPrice_Converted: "$51.17",
                freightAmount_Converted: "$1.99",
                buttons_data: "3256805870544221,0",
              },
            ],
            products_count: 82,
            shipping_methods: [
              {
                company: "CAINIAO_STANDARD",
                companyDisplayName: "AliExpress Standard Shipping",
                exists: true,
              },
              {
                company: "DHL",
                companyDisplayName: "DHL",
                exists: true,
              },
              {
                company: "CAINIAO_PREMIUM",
                companyDisplayName: "AliExpress Premium Shipping",
              },
              {
                company: "CAINIAO_FULFILLMENT_STD",
                companyDisplayName: "Aliexpress Selection Standard",
              },
              {
                company: "CAINIAO_STANDARD_SG_AIR",
                companyDisplayName: "Cainiao Standard - SG Air",
              },
              {
                company: "CPAP",
                companyDisplayName: "China Post Air Parcel",
              },
              {
                company: "EMS",
                companyDisplayName: "EMS",
              },
              {
                company: "FEDEX_IE",
                companyDisplayName: "Fedex IE",
              },
              {
                company: "FEDEX",
                companyDisplayName: "Fedex IP",
              },
              {
                company: "UPSE",
                companyDisplayName: "UPS Expedited",
              },
              {
                company: "UPS",
                companyDisplayName: "UPS Express Saver",
              },
              {
                company: "E_EMS",
                companyDisplayName: "e-EMS",
              },
            ],
            __v: 0,
          }
      )
    )
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};
