const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

const fs = require("fs");

const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


require("./routes/auth.route")(app);
require("./routes/user.route")(app);
require("./routes/membership.route")(app);
require("./routes/invoice.route")(app);
require("./routes/ads.route")(app);
require("./routes/products.route")(app);
require("./routes/sales.route")(app);
require("./routes/chart.route")(app);
require("./routes/nexus.route")(app);
require("./routes/amazon.route")(app);
require("./routes/setting.route")(app);


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
