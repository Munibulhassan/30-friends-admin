const express = require("express");
const Router = express.Router();
const subscription = require("../controller/subscription.js");
const { verifytoken } = require("../middleware/auth.js");

const router = () => {
  Router.post("/", subscription.createsubscription);
  Router.get("/", subscription.getsubscription);
  Router.patch("/:id", subscription.updatesubscription);
  Router.delete("/:id", subscription.deletesubscription); 
  Router.post("/subscribe",verifytoken,subscription.subscribed)
  Router.post("/cancelsubscription",verifytoken,subscription.cancelsubscription)

  return Router;
};
module.exports = router();
