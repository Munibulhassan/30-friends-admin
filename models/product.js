const mongoose = require("mongoose");
const product = mongoose.Schema(
  {
    title: {
      type: String,
    },
    SKU: {
      type: String,
    },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
    tags: {
      type: Array,
      default: [],
    },
    short_description: { type: String },
    full_description: { type: String },
    subcategories: { type: mongoose.Schema.Types.ObjectId, ref: "subcategory" },
    categories: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    brands: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
    store: { type: String },

    customization: { type: Boolean },
    status: {
      type: String,
      default:"pending",
      enum: ["draft", "pending", "published", "archived"],
    },
    is_approved: { type: Boolean, default: false },
    regular_price: { type: Number },
    discounted_price: { type: Number },

    stock: { type: Number },
    weight: { type: String },
    length: { type: String },
    breadth: { type: String },
    height: { type: String },
    warranty: { type: String },
    varient: { type: {} },
    image: {
      type: Array,
    },
    video: {
      type: Array,
    },
    vendor:{ type: mongoose.Schema.Types.ObjectId, ref: "users" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", product);
