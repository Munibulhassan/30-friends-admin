const mongoose = require("mongoose");

const collection = mongoose.Schema(
  {
    store: { type: mongoose.Schema.Types.ObjectId, ref: "store" },    
    name:String
  },
  { timestamps: true }
);

module.exports = mongoose.model("collection", collection);
