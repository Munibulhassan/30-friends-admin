const  mongoose = require("mongoose");
const wishlist = mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "users"},
    product:{ type: mongoose.Schema.Types.ObjectId, ref: "product"}   ,
    
},
{ timestamps: true }
);

module.exports = mongoose.model("wishlist", wishlist);


