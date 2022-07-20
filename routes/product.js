const express = require("express");
const Router = express.Router();
const product = require("../controller/product");
const multer = require("multer");
const path = require("path");
const { verifyadmintoken, verifytoken } = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/product/");
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
  Router.post("/", upload.array("file"), product.createProduct);
  Router.get("/", product.getProduct);
  Router.patch("/:id", upload.array("file"),  product.updateProduct);
  Router.delete("/:id", product.deleteProduct);
  Router.patch('/publish/:id',verifytoken, product.publishProduct)
  
  ///comment
  Router.post('/comment',product.createcomment)
  Router.get('/comment',product.getcomment)
  Router.patch('/comment/:id',product.updatecomment)
  Router.delete('/comment/:id',product.deletecomment)

  ///like
  Router.post('/like',product.createlike)
  Router.get('/like',product.getlike)
  // Router.patch('/like/:id',product.updatelike)
  // Router.delete('/like/:id',product.deletelike)




  return Router;
};
module.exports = router();
