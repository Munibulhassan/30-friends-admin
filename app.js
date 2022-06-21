const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(bodyParser.json());
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/turbo",
  {
    useNewUrlParser: true,
  },
  (err, data) => {
    if (!err) {
      console.log("Database Successfully connected");
    } else {
      console.log(err);
    }
  }
);
//routes
const route = require("./routes/routes");

//sql connected

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
//Routing

app.use("/api", route);

// app.use("/", (req, res, next) => {
//   console.log(req.url);
//   next();
// });

const url = process.env.PORT && 5000;
app.listen(url, () => {
  console.log("Server is Running on port " + url);
});
