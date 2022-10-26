const mongoose = require("mongoose");

const store = mongoose.Schema(
  {
    logo: String,
    name: String,
    address: { type: String, required: true },
    state: String,
    city: String,
    social: String,
    phone: Number,
    storelong: String,
    storelat: String,
    registeration_file: String,
    government_file: String,
    government_file_type: {
      type: String,
      enum: [
        "national_id",
        "international_pasword",
        "voters_card",
        "driving_license",
      ],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    payment: String,
    email: String,
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("store", store);
