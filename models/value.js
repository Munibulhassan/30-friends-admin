const mongoose = require("mongoose");
const value = mongoose.Schema(
  {
    key:{type:String,enum:["color","brand"]},
    value: String
  },
  { timestamps: true }
);
module.exports = mongoose.model("value", value);
