const mongoose = require("mongoose");
const cart = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product:[ { type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    quantity:[{type:Number}],
    amount:[{type:Number}],
    subtotal:[{type:Number}],
    total :{type:Number}

    

},{timestamps: true})
module.exports = mongoose.model("cart", cart);
