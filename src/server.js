const express = require("express");
const app = express();
const instock = require(__dirname + "/routes/instock");
const store = require(__dirname + "/routes/store");

app.use(express.json());
app.use('/instock', instock);
app.use('/store', store);

app.listen(3000, function () {
  console.log("Listening");
});
