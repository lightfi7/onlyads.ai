const mongoose = require("mongoose");

mongoose
  .connect("mongodb://app.onlyads.ai:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "mydatabase",
    user: "root",
    pass: "mari2Ana23sem",
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

var productSchema = mongoose.Schema({
  storeId: { type: String, index: true },
  store: {},
  title: String,
  handle: String,
  images: Number,
  variants: Number,
  main_image: String,
  original_price: String,
  usd_price: Number,
  created_at: { type: String, index: true },
});

const StoreProduct = mongoose.model("storeproducts", productSchema);

(async () => {
  setTimeout(() => {
    // Assuming `StoreProduct` is your Mongoose model
    StoreProduct.aggregate([
        { $match: { "store.id": { $exists: true } } }, // Match documents where store.id exists
        { $addFields: { storeId: "$store.id" } }, // Add/Update the storeId field
        {
          $merge: {
            into: "storeproducts", // Merge results back into the original collection
            on: "_id", // Use the _id field to match documents
            whenMatched: "replace", // Replace the whole document
            whenNotMatched: "discard" // Discard if there's no match (shouldn't happen in this case)
          }
        }
      ]).exec()
      .then(() => console.log("Documents updated."))
      .catch((error) => console.error("Error updating documents:", error));
  }, 1000);
})();
