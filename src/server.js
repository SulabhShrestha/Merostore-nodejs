const express = require("express");
const app = express();
const instock = require(__dirname + "/routes/instock");

app.use(express.json());
app.use('/instock', instock);

app.listen(3000, function () {
  console.log("Listening");
});
