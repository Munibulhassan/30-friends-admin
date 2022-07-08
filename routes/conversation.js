const express = require("express");
const Router = express.Router();
const conversation = require("../controller/conversation");
const { verifytoken } = require("../middleware/auth");



const router = () => {
Router.get('/',verifytoken,conversation.getconversations)
  



  return Router;
};
module.exports = router();
