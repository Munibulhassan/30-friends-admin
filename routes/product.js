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

  return Router;
};
module.exports = router();
