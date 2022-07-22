
const mongoose = require("mongoose");

const compaign = mongoose.Schema({
  image:String,
   heading:String,
   text:String,
   from:{type:Date},
   to:{type:Date},
   status:{type:String, default:"open",enum:["open","closed"]},
   user:{ type: mongoose.Schema.Types.ObjectId, ref: "users"},
   products: { type: [mongoose.Schema.Types.ObjectId], ref: "product"},
   participants: { type:[ mongoose.Schema.Types.ObjectId], ref: "users" }




},
    { timestamps: true }
  );
  
  module.exports = mongoose.model("compaign", compaign);
  