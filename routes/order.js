const express = require("express");
const Router = express.Router();
const order = require("../controller/order");



const router = () => {
  Router.post("/",  order.createorder);  
  Router.get("/", order.getorder);
  Router.patch("/:id",  order.updateorder);
  Router.delete("/:id", order.deleteorder);  

  Router.post("/assignorder", order.assignorder);//rider
  Router.patch('/reject/:id', order.rejectorder) //vendor
  Router.patch('/delivered/:id', order.deliveredorder) //rider
  Router.patch('/completed/:id', order.completedorder) //customer
  



  return Router;
};
module.exports = router();
