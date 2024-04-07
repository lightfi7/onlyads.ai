const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
require("dotenv").config();

// const https = require("https");
const fs = require("fs");

// const privateKey = fs.readFileSync("cert/private.key", "utf8");
// const certificate = fs.readFileSync("cert/app_onlyads_ai.crt", "utf8");
// const credentials = { key: privateKey, cert: certificate };

const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

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

// // // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to Fi." });
// });

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

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "/dist")));
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// send back React's index.html file.
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/dist/index.html"));
// });

// set port, listen for requests
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// const httpsServer = https.createServer(credentials, app);

// const port = 443; // HTTPS default port
// httpsServer.listen(port, () => {
//   console.log(`HTTPS server is running on port ${port}`);
// });
