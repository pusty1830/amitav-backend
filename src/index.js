const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config/db.config");
const path = require("path");

require("dotenv").config();

const port = process.env.PORT;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    // "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    "*"
  );
  next();
});

const buildPath = path.join(__dirname, "../amitav-client/build");

sequelize
  .authenticate()
  .then(async () => {
    sequelize.sync({ force: false, alter: true });
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database:", err);
  });

app.use("/api", require("./routes"));
// app.use(express.static(buildPath));

app.listen(port, () => {
  console.log("Your Server running at " + port);
});

module.exports = app;
