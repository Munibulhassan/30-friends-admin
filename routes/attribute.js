const express = require("express");
const Router = express.Router();
const attribute = require("../controller/attributes.js");

const router = () => {
  Router.post("/",attribute.addattribute);
  Router.get("/", attribute.getattribute);
  Router.patch("/:id", attribute.updateattribute);
  

  Router.post("/value", attribute.addvalue);
  Router.get("/value/:key", attribute.getvalue);
  Router.patch("/value/:id", attribute.updatevalue);


  return Router;
};
module.exports = router();