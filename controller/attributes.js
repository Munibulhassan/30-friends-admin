const attribute = require("../models/attribute");

exports.addattribute = async (req, res) => {
  try {
    const { key, value, product } = req.body;
    if (!(key && value && product)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Attributes = new attribute(req.body);
      Attributes.save().then((item) => {
        res.status(200).send({
          message: "Attributes save successfully",
          data: item,
          success: true,
        });
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getattribute = async (req, res) => {
  try {
    const { product } = req.query;
    if (product) {
      attribute.find({ product: product }, async (err, result) => {
        if (result) {
          res.status(200).json({
            message: "attributes get successfully",
            success: true,
            data: result,
          });
        } else {
          res.status(200).json({
            message: "Error Occured",
            success: false,
          });
        }
      });
    } else {
      res.status(200).json({
        success: true,
        message: "product id is required",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updateattribute = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      attribute.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          attribute.updateOne({ _id: id }, req.body, (err, result) => {
            if (err) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data updated Successfully",
                success: true,
                data: result,
              });
            }
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

const value = require("../models/value");
exports.addvalue = async (req, res) => {
  try {
    const Value = new value(req.body);
    Value.save().then((item) => {
      res.status(200).send({
        message: "Values save successfully",
        data: item,
        success: true,
      });
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getvalue = async (req, res) => {
  try {
    const {key}= req.params;
    if(key){

        value.find({key:key}, async (err, result) => {
          if (result.length>0) {
            res.status(200).json({
              message: "values get successfully",
              success: true,
              data: result,
            });
          } else {
            res.status(200).json({
              message: "No data exist",
              success: false,
            });
          }
        });
    }else{
        value.find({}, async (err, result) => {
            if (result) {
              res.status(200).json({
                message: "values get successfully",
                success: true,
                data: result,
              });
            } else {
              res.status(200).json({
                message: "Error Occured",
                success: false,
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

exports.updatevalue = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      value.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          value.updateOne({ _id: id }, req.body, (err, result) => {
            if (err) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data updated Successfully",
                success: true,
                data: result,
              });
            }
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
