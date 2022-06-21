const mongoose = require("mongoose");
const auth = mongoose.Schema(
  {
    store_name: String,
    email: { type: String, unique: true },
    first_name: String,
    last_name: String,
    
    is_email_verify: Boolean,
    is_phone_verify: Boolean,
    store_link: String,
    phone: Number,
    password: String,
    referal_code: String,
    own_ref_code: String,
    state: String,
    city: String,
    e_otp: Number,
    p_otp: Number,
    user_type: {
      type: String,
      enum: ["admin", "buyer", "shopper"]
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("users", auth);
