const express = require("express");
const Router = express.Router();
const compaign = require("../controller/compaign");
const multer = require("multer");
const path = require("path");
const { verifytoken } = require("../middleware/auth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/compaign/");
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
  Router.post("/", upload.single('file'), verifytoken,compaign.createcompaign);  
  Router.get("/", compaign.getcompaign);
  Router.patch("/:id",upload.single('file'),  compaign.updatecompaign);
  Router.delete("/:id", compaign.deletecompaign);  

 
  



  return Router;
};
module.exports = router();
