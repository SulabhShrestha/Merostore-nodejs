require("dotenv").config();

const express = require("express");
const authChecker = require("./middleware/authChecker");
const app = express();

const instock = require(__dirname + "/routes/instock");
const store = require(__dirname + "/routes/store");
const user = require(__dirname + "/routes/user");
const sales = require(__dirname + "/routes/sales");

const connectDB = require(__dirname + "/db_connection.js");

connectDB();

app.use(express.json());
app.use("/user", user); // no auth checking when creating user
app.use(authChecker);
app.use("/instock", instock);
app.use("/store", store);

app.use("/sales", sales);

app.listen(process.env.PORT, function () {
  console.log("Listening to port" + process.env.PORT);
});
