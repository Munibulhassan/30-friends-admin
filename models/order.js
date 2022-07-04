const mongoose = require("mongoose");
const order = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    status: {type:String,enum:["pending","assigned","delivered","completed","rejected"] , default: "pending"},
    reason : { type:String}
},
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
