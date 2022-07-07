const  mongoose = require("mongoose");
const likes = mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: "users"},
    product:{ type: mongoose.Schema.Types.ObjectId, ref: "product"}   ,
    
},
{ timestamps: true }
);

module.exports = mongoose.model("likes", likes);


