const UserModel = require("../models/user_model");

const authChecker = async function (req, res, next) {
  if (!req.headers.authorization) {
    //TODO: later valid uid should be checked
    res.status(401).send("Unauthorized");
    return;
  }

  // that means firebase auth token is passed
  else {
    const data = await UserModel.findOne({ userId: req.headers.authorization });

    if (!data) {
      res.status(400).send("User doesn't exists.");
      return;
    }
  }
  next();
};

module.exports = authChecker;
