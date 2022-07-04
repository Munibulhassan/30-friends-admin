
const mongoose = require("mongoose");

const brand = mongoose.Schema({
  
    brand_name:String,
    subcategory:{type:mongoose.Schema.Types.ObjectId,
    ref:"subcategory"
  },
  category:{type:mongoose.Schema.Types.ObjectId,
    ref:"category"
  },
    image:String
    

},
    { timestamps: true }
  );
  
  module.exports = mongoose.model("brand", brand);
  