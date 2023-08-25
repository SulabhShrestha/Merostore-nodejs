const authChecker = function (req, res, next) {
  if (!req.headers.authorization) {
    //TODO: later valid uid should be checked
    res.status(401).send("Unauthorized");
    return;
  }
  next();
};

module.exports = authChecker;
