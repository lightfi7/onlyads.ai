const mongoose = require("mongoose");
const TopStore = require("./models/sales-tracker/topstore.model");
const BestSellingProduct = require("./models/sales-tracker/bsproduct");
BestSellingProduct
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
        const products = await TopStore.find({}).skip(i * 10000).limit(10000);
        console.log(i)
        if (products.length === 0) break;
        for (let j = 0; j < products.length; j++) {
            const product = products[j];
            const chart2 = new BestSellingProduct(product.best_selling_products);
            await chart2.save();
            product.best_selling_product = chart2._id;
            await product.save();
            console.log(product);
        }
    }

    console.log(';)')
})();