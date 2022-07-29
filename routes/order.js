const express = require("express");
const Router = express.Router();
const order = require("../controller/order");
const multer = require("multer");
const path = require("path");
const { verifytoken } = require("../middleware/auth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/order/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  var upload = multer({ storage: storage });



const router = () => {
  Router.post("/", upload.single("file"), order.createorder);  
  Router.get("/", order.getorder);
  Router.patch("/:id", upload.single("file"),  order.updateorder);
  Router.delete("/:id", order.deleteorder);  
  Router.patch("/review/:id",order.driverreview)

  Router.patch("/assignorder/:id", order.assignorder);//rider
  Router.patch('/reject/:id', order.rejectorder) //vendor
  Router.patch('/delivered/:id', order.deliveredorder) //rider
  Router.patch('/completed/:id', order.completedorder) //customer
   
  Router.post("/support",verifytoken,order.createsupport)
  Router.get("/support",verifytoken,order.getsupport)
////
Router.post('/cart',verifytoken,order.createcart)
Router.get('/cart',verifytoken,order.getcart)
Router.patch('/cart/:id',verifytoken,order.updatecart)




  return Router;
};
module.exports = router();
