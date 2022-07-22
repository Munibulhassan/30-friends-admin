const mongoose = require("mongoose");
const order = mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },

    status: {
      type: String,
      enum: ["pending", "assigned", "delivered", "completed", "rejected"],
      default: "pending",
    },
    reason: { type: String },
    quantity: { type: Number },
    varient: {},
    orderid: { type: String, unique: true },
    address: { type: String },
    note: { type: String },
    costomerlatitude:{type:Number},
    costomerlongitude:{type:Number},
    driverlatitude:{type:Number},
    driverlongitude:{type:Number},
    pickuptime: { type: Date },
    dropofftime: { type: Date },
    distance: { type: Number },
    star: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
