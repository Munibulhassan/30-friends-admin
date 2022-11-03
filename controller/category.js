const express = require("express");

const category = require("../models/category");
const subcategory = require("../models/subcategory");
const brand = require("../models/brand");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

///category
exports.createcategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      if (req.file) {
        req.body.image = req.file.filename;
        //   await uploadFile(req.file);
      }

      const Category = new category(req.body);
      Category.save().then((item) => {
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
var product = require("../models/product");
exports.getcategory = async (req, res) => {
  try {
    
    const { page, limit } = req.query;
    if (req.query._id) {
      category.findOne({ _id: req.query._id }, (err, data) => {
        if (data) {
          subcategory.find({ category: req.query._id }, async (err, result) => {
            if (result) {
              product.find(
                { category: req.query._id },
                async (err, product) => {
                  res.status(200).send({
                    message: "Data get Successfully",
                    success: true,
                    data: {
                      _id: data._id,
                      category_name: data.category_name,
                      image: data.image,
                      subcategory: result,
                      createdAt: data.createdAt,
                      updatedAt: data.updatedAt,
                      product: product.slice(0,5),
                    },
                  });
                }
              );
            } else {
              res.status(200).json({
                success: false,
                message: err.message,
              });
            }
          });
        } else {
          res.status(200).json({
            success: false,
            message: err.message,
          });
        }
      });
    } else {
      const data = await category
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
    }
  } catch (err) {
  
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatecategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      category.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.file) {
            if (result.image) {
              await unlinkAsync(`uploads/category/` + result.image);
            }

            req.body.image = req.file.filename;
          }
          category.updateOne({ _id: id }, req.body, (err, result) => {
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

exports.deletecategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      category.findOne({ _id: id }, async (err, result) => {
        if (result) {
          await unlinkAsync(`uploads/category/` + result.image);

          category.deleteOne({ _id: id }, (err, val) => {
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
///subcategory
exports.createsubcategory = async (req, res) => {
  try {
    category.find({ _id: req.body.category }, (err, result) => {
      if (result) {
        const { subcategory_name, category } = req.body;
        if (!(subcategory_name && category)) {
          res
            .status(200)
            .send({ message: "All input is required", success: false });
        } else {
          req.body.image = req.file.filename;
          // if (req.file) {
          //   await uploadFile(req.file);
          // }

          const Subcategory = new subcategory(req.body);
          Subcategory.save().then((item) => {
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              success: true,
            });
          });
        }
      } else {
        res.status(200).send({ message: "Invalid Category", success: false });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err._message,
    });
  }
};

exports.getsubcategory = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await subcategory
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

exports.updatesubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      subcategory.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.file) {
            await unlinkAsync(`uploads/category/` + result.image);

            req.body.image = req.file.filename;
          }
          subcategory.updateOne({ _id: id }, req.body, (err, result) => {
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

exports.deletesubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      subcategory.findOne({ _id: id }, async (err, result) => {
        if (result) {
          await unlinkAsync(`uploads/category/` + result.image);

          subcategory.deleteOne({ _id: id }, (err, val) => {
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

///brand
exports.createbrand = async (req, res) => {
  try {
    subcategory.findOne({ _id: req.body.subcategory }, (err, result) => {
      if (result) {
        const { brand_name, subcategory } = req.body;
        if (!(subcategory && brand_name)) {
          res
            .status(200)
            .send({ message: "All input is required", success: false });
        } else {
          req.body.category = result.category;
          if (req.file) {
            req.body.image = req.file.filename;
            //   await uploadFile(req.file);
          }

          const Brand = new brand(req.body);
          Brand.save().then((item) => {
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              success: true,
            });
          });
        }
      } else {
        res
          .status(200)
          .send({ message: "Invalid Sub-Category", success: false });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getbrand = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await brand
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

exports.updatebrand = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      brand.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.file) {
            await unlinkAsync(`uploads/category/` + result.image);

            req.body.image = req.file.filename;
          }
          brand.updateOne({ _id: id }, req.body, (err, result) => {
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

exports.deletebrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      brand.findOne({ _id: id }, async (err, result) => {
        if (result) {
          await unlinkAsync(`uploads/category/` + result.image);

          brand.deleteOne({ _id: id }, (err, val) => {
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
