const mongoose = require("mongoose");
const support = mongoose.Schema({
category: { type:String},

priority: {type:String, enum :["Normal","Low","Medium","High","Urgent","Critical"]},
product:{ type: mongoose.Schema.Types.ObjectId, ref: "product"}   ,
issue:{type:String},
user:{ type: mongoose.Schema.Types.ObjectId, ref: "users"}   ,
order:{ type: mongoose.Schema.Types.ObjectId, ref: "order"}   


},{ timestamps: true }
    );
    
    module.exports = mongoose.model("support", support);
    
    
    