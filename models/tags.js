const mongoose = require("mongoose");
const tags = mongoose.Schema(
  {
    
    name: String
  },
  { timestamps: true }
);
module.exports = mongoose.model("tags", tags);
