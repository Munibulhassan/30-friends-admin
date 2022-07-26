const express = require("express");
const Router = express.Router();
const following = require("../controller/following.js");
const {  verifytoken } = require("../middleware/auth");

const router = () => {
  Router.post("/",verifytoken, following.addfollow);
  Router.get("/",verifytoken,following.getfollowing);
  

  return Router;
};
module.exports = router();