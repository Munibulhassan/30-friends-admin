const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const product = require("../models/product");
const wishlist = require("../models/wishlist");

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      SKU,
      tags,
      short_description,
      sale_price,
      stock,
      brand,
      vendor,
    } = req.body;
    if (
      !(
        title &&
        SKU &&
        tags &&
        short_description &&
        sale_price &&
        stock &&
        vendor
      )
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      if (req.files) {
        req.body.image = [];
        req.files.map((item) => {
          req.body.image.push(item.filename);
        });
      }
      req.body.upsells = JSON.parse(req.body.upsells);
      req.body.crosssells = JSON.parse(req.body.crosssells);
      if (req.body.customize) {
        req.body.customize = JSON.parse(req.body.customize);
      }

      req.body.tags = JSON.parse(req.body.tags);
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
    req.query = Object.fromEntries(
      Object.entries(req.query).filter(
        ([_, v]) => v != "" && v != " " && v != "null"
      )
    );
    const { page, limit, search, vendor, _id, tags } = req.query;
    if (req.params.method == "discount") {
      const list = await product
        .find(req.query)

        .populate({ path: "category" })
        .populate({ path: "subcategory" })
        .populate({ path: "tags" })
        .populate({ path: "brand" })
        .populate({
          path: "vendor",
          select: ["endsAt", "interval", "subscription"],
        })
        .populate({
          path: "upsells",
        })
        .populate({
          path: "crosssells",
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const data = list.filter((item) => {
        return (
          ((item.regular_price - item.sale_price) / item.regular_price) * 100 >
          40
        );
      });

      if (data.length == 0) {
        res.status(200).send({ message: "Data Not Exist", success: false });
      } else {
        res.status(200).send({
          message: "Data get Successfully",
          success: true,
          count: data.length,
          data: data,
        });
      }
    } else {
      if (search) {
        const list = await product
          .find(req.query)
          .populate({ path: "category" })
          .populate({ path: "subcategory" })
          .populate({ path: "tags" })
          .populate({ path: "brand" })
          .populate({
            path: "vendor",
            select: ["endsAt", "interval", "subscription"],
          })
          .populate({
            path: "upsells",
          })
          .populate({
            path: "crosssells",
          })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();

        const data = list.filter((item) => {
          return item.title.search(search) != -1;
        });

        if (data.length == 0) {
          res.status(200).send({ message: "Data Not Exist", data:[],success: true });
        } else {
          res.status(200).send({
            message: "Data get Successfully",
            success: true,
            count: data.length,
            data: data,
          });
        }
      } else {
        const data = await product
          .find(req.query)

          .populate({ path: "category" })
          .populate({ path: "subcategory" })
          .populate({ path: "tags" })
          .populate({ path: "brand" })
          .populate({
            path: "vendor",
          })
          .populate({
            path: "upsells",
          })
          .populate({
            path: "crosssells",
          })
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();

        if (data.length == 0) {
          res.status(200).send({ message: "Data Not Exist", success: false });
        } else {
          res.status(200).send({
            message: "Data get Successfully",
            success: true,
            count: data.length,
            data: data,
          });
        }
      }
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
exports.createwishlist = async (req, res) => {
  try {
    const user = req.user._id;
    const Product = req.body.product;
    if (!(user && Product)) {
      res
        .status(200)
        .json({ message: "All input is required", success: false });
    } else {
      wishlist.findOne(
        { user: user, product: Product },
        async (err, result) => {
          if (result) {
            await wishlist.deleteOne({ user: user, product: Product });
            res.status(200).json({
              message: "product successfully remove from wishlist",
              success: true,
            });
          } else {
            const Wishlist = new wishlist({
              user: user,
              product: Product,
            });
            await Wishlist.save().then((data) => {
              res.status(200).json({
                success: true,
                message: "Product successfully add in wishlist ",
                data: data,
              });
            });
          }
        }
      );
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getwishlist = async (req, res) => {
  try {
    req.query = Object.assign(req.query, { user: req.user._id });

    wishlist.find(req.query, (err, result) => {
      if (result.length < 0) {
        res.status(200).send({ message: "Data Not Exist", success: false });
      } else {
        res.status(200).send({
          message: "wishlist get Successfully",
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

const tags = require("../models/tags");
exports.createtags = async (req, res) => {
  try {
    const name = req.body.name.toLowerCase();

    if (!name) {
      res
        .status(200)
        .json({ message: "All input is required", success: false });
    } else {
    }
    tags.findOne({ name: req.body.name }, async (err, body) => {
      if (body) {
        res.status(200).json({
          message: "tag already exist",
          success: true,
        });
      } else {
        const tag = new tags({ name: req.body.name });
        await tag.save().then((data) => {
          res.status(200).json({
            success: true,
            message: "Tags successfully saved",
            data: data,
          });
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

exports.gettags = async (req, res) => {
  try {
    tags.find({}, (err, result) => {
      if (result.length == 0) {
        res.status(200).send({ message: "Data Not Exist", success: false });
      } else {
        res.status(200).send({
          message: "tags get Successfully",
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

exports.updatetags = async (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deletetags = async (req, res) => {
  try {
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
