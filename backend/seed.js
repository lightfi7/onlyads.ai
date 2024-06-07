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
  await TopStore.updateMany({}, { $unset: { aggregations: '' } })
  await TopProduct.updateMany({}, { $unset: { aggregations: '' } })
  console.log(';)')
})();
