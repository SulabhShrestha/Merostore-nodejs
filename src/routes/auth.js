const express = require("express");
const passport = require("passport");
const router = express.Router();

// this pops up the google login page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  }), function(req, res){
    console.log("google login page")
  }
);


// here we can get the user data
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
