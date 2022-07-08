const express = require("express");
const Router = express.Router();
const message = require("../controller/message");
const multer = require("multer");
const path = require("path");
const {  verifytoken } = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/message/");
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
  Router.post("/", upload.array("file"), message.createmessage);
  Router.get("/:conversationId", message.getmessage);

  Router.delete("/:id", message.deletemessage);

  

  return Router;
};
module.exports = router();