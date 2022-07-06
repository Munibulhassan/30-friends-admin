
const mongoose = require("mongoose");

const comments = mongoose.Schema({
  
    text: String,
    rate:Number,
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "users"},
    product:{ type: mongoose.Schema.Types.ObjectId, ref: "product"}


},
    { timestamps: true }
  );
  
  module.exports = mongoose.model("comments", comments);
  