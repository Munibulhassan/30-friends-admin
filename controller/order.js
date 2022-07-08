const fs = require("fs");
const { promisify } = require("util");
const conversation = require("../models/conversation");
const unlinkAsync = promisify(fs.unlink);
const order = require("../models/order");
const Product = require("../models/product");

exports.createorder = async (req, res) => {
  try {
    const { customer, product, quantity } = req.body;
    if (!(customer && product)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      Product.findOne({ _id: product }, (err, result) => {
        if (result.stock < quantity) {
          res.status(200).send({
            message: "Cannot order more then stock",

            success: false,
          });
        } else {
          Product.updateOne(
            { _id: product },
            { $inc: { stock: -quantity, "metrics.orders": 1 } },
            (err, updated) => {
              if (err) {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              } else {
                const Order = new order(req.body);
                Order.save().then((item) => {
                  res.status(200).send({
                    message: "Thank you for your order",
                    data: item,
                    success: true,
                  });
                });
              }
            }
          );
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

exports.getorder = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await order
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
exports.updateorder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      order.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          order.updateOne({ _id: id }, req.body, (err, result) => {
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
exports.deleteorder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      order.findOne({ _id: id }, async (err, result) => {
        if (result) {
          order.deleteOne({ _id: id }, (err, val) => {
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
          res.status(200).send({ message: "Order Not exist", success: false });
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
exports.rejectorder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      order.findOne({ _id: id }, async (err, result) => {
        if (result) {
          if (result.status != "pending") {
            res.status(200).json({
              message: "Order cannot be cancelled",
              success: false,
            });
          } else {
            order.updateOne(
              { _id: id },
              { reason: req.body.reason, status: "rejected" },
              (err, val) => {
                if (!val) {
                  res
                    .status(200)
                    .send({ message: err.message, success: false });
                } else {
                  res.status(200).send({
                    message: "order Cancelled Successfully",
                    success: true,
                  });
                }
              }
            );
          }
        } else {
          res.status(200).end({ message: "order Not exist", success: false });
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

exports.assignorder = async (req, res) => {
  try {
    const { id } = req.query;
    order.findOne({ _id: id }, async (err, result) => {
      if (result) {
        if (result.status != "pending") {
          res.status(200).json({
            success: false,
            message: "Order cannot be assigned",
          });
        } else {
          order.updateOne(
            { _id: id },
            { driver: req.body._id || req.user._id, status: "assigned" },
            async (err, value) => {
              if (value) {
                const Conversation = new conversation({
                  members : [req.body._id || req.user._id , result.customer]
                  
                });
                await Conversation.save();
                res.status(200).json({
                  success: true,
                  message: "Product is Successfully assign for delivering",
                });
              } else {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              }
            }
          );
        }
      } else {
        res.status(200).end({ message: "order Not exist", success: false });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deliveredorder = async (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, async (err, result) => {
      if (result) {
        if (result.status != "assigned") {
          res.status(200).json({
            success: false,
            message: "Order cannot be deliverd",
          });
        } else {
          order.updateOne(
            { _id: id },
            { status: "delivered" },
            async (err, value) => {
              if (value) {
                res.status(200).json({
                  success: true,
                  message: "Product is Successfully Delivered",
                });
              } else {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              }
            }
          );
        }
      } else {
        res.status(200).end({ message: "order Not exist", success: false });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.completedorder = async (req, res) => {
  try {
    const { id } = req.params;
    order.findOne({ _id: id }, async (err, result) => {
      if (result) {
        if (result.status != "delivered") {
          res.status(200).json({
            success: false,
            message: "Order cannot be Completed",
          });
        } else {
          order.updateOne(
            { _id: id },
            { status: "completed" },
            async (err, value) => {
              if (value) {
                res.status(200).json({
                  success: true,
                  message: "Delivering process is Successfully completed",
                });
              } else {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              }
            }
          );
        }
      } else {
        res.status(200).end({ message: "order Not exist", success: false });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
