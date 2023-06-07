const express = require("express");
const app = express();
const instock = require(__dirname + "/routes/instock");
const store = require(__dirname + "/routes/store");
const user = require(__dirname + "/routes/user");
// const sales = require(__dirname + "/routes/sales");

app.use(express.json());
app.use('/instock', instock);
app.use('/store', store);
app.use('/user', user);
// app.use("/sales", sales);

app.listen(3000, function () {
  console.log("Listening");
});
