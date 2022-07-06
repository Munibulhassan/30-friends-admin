const express = require("express");
const Router = express.Router();
const product = require("../controller/product");
const multer = require("multer");
const path = require("path");
const { verifyadmintoken } = require("../middleware/auth");
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
  Router.patch('/publish/:id', product.publishProduct)
  Router.post('/comment',product.createcomment)
  Router.get('/comment',product.getcomment)
  Router.patch('/comment/:id',product.updatecomment)
  Router.delete('/comment/:id',product.deletecomment)




  return Router;
};
module.exports = router();
