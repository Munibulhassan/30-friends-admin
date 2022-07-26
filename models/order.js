const mongoose = require("mongoose");
const order = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product:[ { type: mongoose.Schema.Types.ObjectId, ref: "product" }],

    status: {
      type: String,
      enum: ["On hold", "Processing", "pending payment", "completed", "rejected"],
      default: "On hold",
    },
    reason: { type: String },
    quantity: [{ type: Number }],
    discount: [{ type: Number }],
    shipping: [{ type: Number }],
    amount: { type: Number},
    payment_method :{type: String},
    varient: {},
    orderid: { type: String, unique: true },
    billing_address: { type: String },
    shipping_address: { type: String },
    note: { type: String },
    costomerlatitude:{type:Number},
    costomerlongitude:{type:Number},
    driverlatitude:{type:Number},
    driverlongitude:{type:Number},
    pickuptime: { type: Date },
    dropofftime: { type: Date },
    distance: { type: Number },
    star: { type: Number },
    file:{type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
