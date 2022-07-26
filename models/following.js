const mongoose = require("mongoose");

const following = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    vendor: { type: [mongoose.Schema.Types.ObjectId], ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("following", following);
