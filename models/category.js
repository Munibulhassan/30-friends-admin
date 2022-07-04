
const mongoose = require("mongoose");

const category = mongoose.Schema({
  
category_name:String,
image:String

},
    { timestamps: true }
  );
  
  module.exports = mongoose.model("category", category);
  