const mongoose = require("mongoose");
const auth = mongoose.Schema(
  {
    store_name: String,
    email: { type: String, unique: true, required: true },
    first_name: String,
    last_name: String,
    googleId:String,
    facebookId:String,
    userId: String,
    is_email_verify: { type: Boolean, default: false },
    is_phone_verify: { type: Boolean, default: false },
    store_link: String,
    phone: {type:String,unique: true},
    password: String,
    referal_code: String, ///own_ref_code
    referrer: String, // sender
    state: String,
    city: String,
    e_otp: Number,
    p_otp: Number,
    endsAt:{type:Date},
    subscription:{type:mongoose.Schema.Types.ObjectId, ref: "subscription"},
    interval:{type:String,enum:["monthly","annual"]},
    ends_at:String,
    response_rate:{type:Number},
    user_type: {
      type: String,
      enum: [
        "admin",
        "buyer",
        "vendor",
        "delivery",
        "Affiliate",
        "vendor_support",
        "customer_support",
        "logistics",
        "operations",
        "s.admin",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", auth);
