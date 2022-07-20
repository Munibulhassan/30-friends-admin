const compaign = require("../models/compaign");
const Product = require("../models/product");
const Auth = require("../models/auth");

exports.createcompaign = async (req, res) => {
  try {
    const { from, to, heading, text } = req.body;

    if (!(from && to && heading && text)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      compaign.findOne({ heading }, (err, result) => {
        if (result) {
          res.status(200).send({
            message: "Compaign with smae name exist use Another name",
            success: false,
          });
        } else {
          req.body.user = req.user._id;
          req.body.image = req.file.filename;
          const Compaign = new compaign(req.body);
          Compaign.asve().then((item) => {
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              success: true,
            });
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updatecompaign = async (req,res)=>{
    try{
        const {id} = req.params
        compaign.findOne({_id:id},async (err, result)=>{
            if(!result)
            {
                res.status(200).json({
                    success: false,
                    message: "No Compaign Exit",
                  });        
            }else{
                compaign.updateOne({_id:id},req.body,(err, value)=>{
                    if(value){
                        res.status(200).json({
                            success: true,
                            message: "Products successfully added",
                          });
                    }
                })
            }
        })
    }catch (err) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      }
}
exports.getcompaign = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await compaign
      .find(req.query)
      .populate("product")
      .populate("customer")
      .populate("driver")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (data.length == 0) {
      res.status(200).send({ message: "Data Not Exist", success: false });
    } else {
      res.status(200).send({
        message: "Data get Successfully",
        success: true,
        data: data,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletecompaign = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      compaign.findOne({ _id: id }, async (err, result) => {
        if (result) {
          compaign.deleteOne({ _id: id }, (err, val) => {
            if (!val) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data deleted Successfully",
                success: true,
              });
            }
          });
        } else {
          res
            .status(200)
            .send({ message: "compaign Not exist", success: false });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
