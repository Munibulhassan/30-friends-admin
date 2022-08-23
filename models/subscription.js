const mongoose = require("mongoose");

const subscription = mongoose.Schema(
  {
    name: String,
    amount: Number,   
  },
  { timestamps: true }
);

module.exports = mongoose.model("subscription", subscription);
