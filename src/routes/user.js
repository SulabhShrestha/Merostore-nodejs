const express = require("express");
const passport = require("passport");
const router = express.Router();


router.get("/aa/google", passport.authenticate("google", { scope: ["profile", "email"] , failureRedirect : '/login'}));

module.exports = router;
