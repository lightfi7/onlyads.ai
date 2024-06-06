const mongoose = require("mongoose");
const Chart2 = require("./models/sales-tracker/chart2.model");
const TopProduct = require("./models/sales-tracker/topproduct.model");
const TopStore = require("./models/sales-tracker/topstore.model");

mongoose
  .connect("mongodb://144.91.126.113:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "onlyads",
    user: "devman",
    pass: "mari2Ana23sem",
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

(async () => {

  for (let i = 0; ; i++) {
    const products = await TopProduct.find({}).skip(i * 10000).limit(i * 10000 + 10000);
    console.log(i)
    if (products.length === 0) break;
    for (const product of products) {
      const chart2 = new Chart2(product.aggregations);
      await chart2.save();
      product.chart2 = chart2._id;
      await product.save();
      console.log(product);
    }
  }
})();
