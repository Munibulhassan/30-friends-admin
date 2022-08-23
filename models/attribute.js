const mongoose = require("mongoose");
const attribnute = mongoose.Schema(
  {
    key: { type: String, enum: ["color", "brand"] },
    value: [{ type: mongoose.Schema.Types.ObjectId, ref: "value" }],
    visible: { type: Boolean, default: true },
    selectall: { type: Boolean, default: false },
    product:{ type: mongoose.Schema.Types.ObjectId, ref: "product" }
  },
  { timestamps: true }
);
module.exports = mongoose.model("attribnute", attribnute);
