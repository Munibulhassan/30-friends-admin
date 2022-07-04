const mongoose = require("mongoose");

const store = mongoose.Schema({
    logo: String,
    address: {type:String,required: true},
    state: String,
    city: String,
    phone:Number,
    registeration_file:String,
    government_file:String,
    government_file_type:{
        type: String,
        enum: ["national_id", "international_pasword", "voters_card","driving_license"]
      }


},
    { timestamps: true }
  );
  
  module.exports = mongoose.model("store", store);
  