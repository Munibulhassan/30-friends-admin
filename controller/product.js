const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const product = require("../models/product");
const likes = require("../models/like");

exports.createProduct = async (req, res) => {
  try {
    const { title, SKU, tags, description, price, stock, brand, vendor } =
      req.body;
    if (
      !(
        title &&
        SKU &&
        tags &&
        description &&
        price &&
        stock &&
        brand &&
        vendor
      )
    ) {
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
    const { page, limit } = req.query;

    const data = await product
      .find(req.query)
      .populate({ path: "categories" })
      .populate({
        path: "vendor",
        select: ["endsAt", "interval", "subscription"],
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (data.length == 0) {
      res.status(200).send({ message: "Data Not Exist", success: false });
    } else {
      const products = data;
      data.map((item, index) => {
        console.log(item?._id,req.user
          )
        likes.findOne(
          { product: item._id, user: req.user?._id },
          (err, result) => {
            if (result != null) {
              products[index].like = true;
            } else {
              products[index].like = false;
            }
            if (index == data.length - 1) {
              res.status(200).send({
                message: "Data get Successfully",
                success: true,
                data: products,
              });
            }
          }
        );
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
          if (req.body.image) {
            req.body.image = JSON.parse(req.body.image);
          }
          if (req.body.video) {
            req.body.video = JSON.parse(req.body.video);
          }

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
        if (req?.user?._id != result?.vendor) {
          res.status(200).send({
            message: "Only Vendor of this product can update product details",
            success: false,
          });
        } else if (result) {
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
        
        if (req?.user?._id != result?.vendor) {
          res.status(200).send({
            message: "Only Vendor of this product can update product details",
            success: false,
          });
        } else if (result) {
          if (result.status == true) {
            res.status(200).send({
              message: "Product Already published",
              success: false,
            });
          } else {
            product.updateOne(
              { _id: id },
              { status: "published" },
              (err, val) => {
                if (!val) {
                  res
                    .status(200)
                    .send({ message: err.message, success: false });
                } else {
                  res.status(200).send({
                    message: "Product Published Successfully",
                    success: true,
                  });
                }
              }
            );
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
const Comment = require("../models/comment");

const { resourceLimits } = require("worker_threads");
const like = require("../models/like");

exports.createcomment = async (req, res) => {
  try {
    const { text, rate, user } = req.body;
    const Product = req.body.product;
    if (!(text && rate && user && Product)) {
      res
        .status(200)
        .json({ message: "All input is required", success: false });
    } else {
      Comment.findOne({ user: user, product: Product }, async (err, result) => {
        if (result) {
          res.status(200).json({
            message: "You already commented to this product",
            success: false,
          });
        } else {
          const comment = new Comment({
            text: text,
            rate: rate,
            user: user,
            product: Product,
          });

          product.updateOne(
            { _id: Product },
            { $inc: { comments: 1, "metrics.orders": 1 } },
            async (err, update) => {
              if (err) {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              } else {
                await comment.save().then((data) => {
                  res.status(200).json({
                    success: true,
                    message: "Product comment Successfully",
                    data: data,
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
exports.getcomment = async (req, res) => {
  try {
    Comment.find(req.query, (err, result) => {
      if (result.length < 0) {
        res.status(200).send({ message: "Data Not Exist", success: false });
      } else {
        res.status(200).send({
          message: "Data get Successfully",
          success: true,
          data: result,
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
exports.updatecomment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      Comment.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          Comment.updateOne({ _id: id }, req.body, (err, result) => {
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

exports.deletecomment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      Comment.findOne({ _id: id }, async (err, result) => {
        if (result) {
          Comment.deleteOne({ _id: id }, (err, val) => {
            if (!val) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              product.updateOne(
                { _id: result.product },
                { $inc: { comments: -1, "metrics.orders": 1 } },
                async (err, update) => {
                  if (err) {
                    res.status(200).json({
                      success: false,
                      message: err.message,
                    });
                  } else {
                    res.status(200).send({
                      message: "Data deleted Successfully",
                      success: true,
                    });
                  }
                }
              );
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

///likes
exports.createlike = async (req, res) => {
  try {
    const { user } = req.body;
    const Product = req.body.product;
    if (!(user && Product)) {
      res
        .status(200)
        .json({ message: "All input is required", success: false });
    } else {
      like.findOne({ user: user, product: Product }, async (err, result) => {
        if (result) {
          await like.deleteOne({ user: user, product: Product });
          product.updateOne(
            { _id: Product },
            { $inc: { likes: -1, "metrics.orders": 1 } },
            async (err, update) => {
              if (err) {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              } else {
                res.status(200).json({
                  message: "product unlike successfully",
                  success: true,
                });
              }
            }
          );
        } else {
          const Like = new like({
            user: user,
            product: Product,
          });

          product.updateOne(
            { _id: Product },
            { $inc: { likes: 1, "metrics.orders": 1 } },
            async (err, update) => {
              if (err) {
                res.status(200).json({
                  success: false,
                  message: err.message,
                });
              } else {
                await Like.save().then((data) => {
                  res.status(200).json({
                    success: true,
                    message: "Product likes Successfully",
                    data: data,
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
exports.getlike = async (req, res) => {
  try {
    like.find(req.query, (err, result) => {
      if (result.length < 0) {
        res.status(200).send({ message: "Data Not Exist", success: false });
      } else {
        res.status(200).send({
          message: "Data get Successfully",
          success: true,
          data: result,
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

// exports.updatelike = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       res.status(200).send({ message: "id is not specify", success: false });
//     } else {
//       Comment.findOne({ _id: id }, async (err, result) => {
//         if (!result) {
//           res.status(200).send({ message: "No Data Exist", success: false });
//         } else {
//           Comment.updateOne({ _id: id }, req.body, (err, result) => {
//             if (err) {
//               res.status(200).send({ message: err.message, success: false });
//             } else {
//               res.status(200).send({
//                 message: "Data updated Successfully",
//                 success: true,
//                 data: result,
//               });
//             }
//           });
//         }
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// exports.deletelike = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       res.status(200).send({ message: "id is not specify", success: false });
//     } else {
//       Comment.findOne({ _id: id }, async (err, result) => {
//         if (result) {
//           Comment.deleteOne({ _id: id }, (err, val) => {
//             if (!val) {
//               res.status(200).send({ message: err.message, success: false });
//             } else {
//               product.updateOne(
//                 { _id: result.product },
//                 { $inc: { comments: -1, "metrics.orders": 1 } },
//                 async (err, update) => {
//                   if (err) {
//                     res.status(200).json({
//                       success: false,
//                       message: err.message,
//                     });
//                   } else {
//                     res.status(200).send({
//                       message: "Data deleted Successfully",
//                       success: true,
//                     });
//                   }
//                 }
//               );
//             }
//           });
//         } else {
//           res.status(200).send({ message: "Data Not exist", success: false });
//         }
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
