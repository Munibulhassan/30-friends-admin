
const mongoose = require("mongoose");

const comments = mongoose.Schema({
  
    text: String,
    rate:{type:Number,minimum:0,maximum:5},
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "users"},
    product:{ type: mongoose.Schema.Types.ObjectId, ref: "product"}


},
    { timestamps: true }
  );
  
  module.exports = mongoose.model("comments", comments);
  