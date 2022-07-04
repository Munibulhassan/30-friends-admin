const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    const { title,SKU, tags, description, price, stock, brand } = req.body;
    if (!(title && SKU && tags && description && price && stock && brand)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      if (req.files) {
        req.body.image = [];
        req.body.video = [];

        req.files.map((item) => {
          if (item?.mimetype?.split("/")[0] == "video") {
            req.body.video.push(item.filename);
          } else {
            req.body.image.push(item.filename);
          }
        });
      }

      const Product = new product(req.body);
      Product.save().then((item) => {
        res.status(200).send({
          message: "Data save into Database",
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

exports.getProduct = async (req, res) => {
  try {
    const { page, limit }= req.query;

    const data = await product
      .find(req.query)
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
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      product.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          req.body.image = JSON.parse(req.body.image);
          req.body.video = JSON.parse(req.body.video);
          if (req.files) {
            req.files.map(async (item) => {
              const i = req.body.image.indexOf("");
              const j = req.body.video.indexOf("");

              if (i != -1 || j != -1) {
                if (item?.mimetype?.split("/")[0] == "video") {
                  req.body.video[j] = item.filename;

                  await unlinkAsync(`uploads/product/` + result.video[j]);
                } else {
                  req.body.image[i] = item.filename;

                  await unlinkAsync(`uploads/product/` + result.image[i]);
                }
              } else {
                return;
              }
            });
          }
          product.updateOne({ _id: id }, req.body, (err, result) => {
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
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      product.findOne({ _id: id }, async (err, result) => {
        if (result) {
          result.image.map(async (item) => {
            await unlinkAsync(`uploads/product/` + item);
          });
          result.video.map(async (item) => {
            await unlinkAsync(`uploads/product/` + item);
          });
          product.deleteOne({ _id: id }, (err, val) => {
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
          res.status(200).send({ message: "Data Not exist", success: false });
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
exports.publishProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      product.findOne({ _id: id }, async (err, result) => {
        if (result) {
          if (result.status == true) {
            res.status(200).send({
              message: "Product Already published",
              success: false,
            });
          } else {
            product.updateOne({ _id: id }, { status: "published" }, (err, val) => {
              if (!val) {
                res.status(200).send({ message: err.message, success: false });
              } else {
                res.status(200).send({
                  message: "Product Published Successfully",
                  success: true,
                });
              }
            });
          }
        } else {
          res.status(200).end({ message: "Product Not exist", success: false });
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
