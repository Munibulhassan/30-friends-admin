const mongoose = require("mongoose");

const subcategory = mongoose.Schema(
  {
    subcategory_name: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("subcategory", subcategory);
