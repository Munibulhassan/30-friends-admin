const express = require("express");
const Router = express.Router();
const store = require("../controller/store.js");
const multer = require("multer");
const path = require("path");
const {  verifytoken } = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/store/");
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
  Router.post("/",verifytoken, upload.array('file'),store.createstore);
  Router.get("/", store.getstore);
  Router.patch("/:id",upload.array('file'), store.updatestore);
  Router.delete("/:id", store.deletestore);
  Router.post("/addcollection", store.addcollection);

  Router.post("/addproduct/:id", store.addproduct);
  Router.get("/collection", store.getcollection);


  return Router;
};
module.exports = router();