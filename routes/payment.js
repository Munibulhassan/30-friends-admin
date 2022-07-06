const express = require("express");
const Router = express.Router();
const payment = require("../controller/payment.js");

const router = () => {
  Router.post("/lazerpay", payment.lazerpaypayment);
  Router.post("/paystack", payment.paystack);
//   Router.get("/", payment.getstore);
//   Router.patch("/:id", payment.updatestore);
//   Router.delete("/:id", payment.deletestore);

  return Router;
};
module.exports = router();
