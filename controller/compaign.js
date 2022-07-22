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

          req.body.from = new Date(JSON.stringify(req.body.from));
          req.body.to = new Date(JSON.stringify(req.body.to));

          const Compaign = new compaign(req.body);
          Compaign.save().then((item) => {
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
exports.updatecompaign = async (req, res) => {
  try {
    const { id } = req.params;
    compaign.findOne({ _id: id }, async (err, result) => {
      if (!result) {
        res.status(200).json({
          success: false,
          message: "No Compaign Exit",
        });
      } else {
        if (req.file) {
          await unlinkAsync(`uploads/compaign/` + result.image);
          req.body.image = req.file.filename;
        }
        compaign.updateOne({ _id: id }, req.body, (err, value) => {
          if (value) {
            if(req.body.products){
              res.status(200).json({
                success: true,
                message: "Products successfully added",
              });
            }else if(req.body.participants){

              res.status(200).json({
                success: true,
                message: "Participants successfully added",
              });
            }
          }
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getcompaign = async (req, res) => {
  try {
    const data = await compaign
      .find(req.query)
      .populate("products")
      .populate("participants")
      .exec();

    if (data.length == 0) {
      res.status(200).send({ message: "Data Not Exist", success: false });
    } else {
      const today = new Date();
      data.map(async (item, index) => {
        const date = new Date(item.from);
        if (
          date.getFullYear() < today.getFullYear() ||
          date.getMonth() < today.getMonth() ||
          date.getDate() < today.getDate()
        ) {
          await compaign.updateOne({ _id: item._id }, { status: "closed" });
        }
        if (index == data.length-1) {
          res.status(200).send({
            message: "Data get Successfully",
            success: true,
            data: await compaign
              .find(req.query)
              .populate("products")
              .populate("participants")
              .exec(),
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
