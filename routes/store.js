const express = require("express");
const Router = express.Router();
const store = require("../controller/store.js");

const router = () => {
  Router.post("/", store.createstore);
  Router.get("/", store.getstore);
  Router.patch("/:id", store.updatestore);
  Router.delete("/:id", store.deletestore);
  

  return Router;
};
module.exports = router();
