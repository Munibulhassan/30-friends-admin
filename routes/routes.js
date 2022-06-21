const express = require("express");
const app = express();
const auth = require('./user')

app.use("/auth", auth);


module.exports = app;
