const store = require("../models/store");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
exports.createstore = async (req, res) => {
  try {
    const { address, city, state, phone } = req.body;
    if (!(address && city && state && phone)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      req.body.user = req.user?._id;
      req.body.logo = req.files[0].filename;
      req.body.registeration_file = req.files[1].filename;
      req.body.government_file = req.files[2].filename;
      const Store = new store(req.body);
      Store.save().then((item) => {
        res.status(200).send({
          message: "Store created successfully",
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

exports.getstore = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await store
      .find(req.query)
      .populate({
        path: "user",
        select: ["first_name", "last_name", "phone", "email"],
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (data.length == 0) {
      res
        .status(200)
        .send({ message: "There is no any store available", success: false });
    } else {
      res.status(200).send({
        message: "Stores get Successfully",
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

exports.updatestore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      store.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          req.body.files?.map(async (item, index) => {
            await unlinkAsync(`uploads/store/` + result[item]);
            req.body[item] = req.files[index].filename;
          });

          store.updateOne({ _id: id }, req.body, (err, result) => {
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

exports.deletestore = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      store.findOne({ _id: id }, async (err, result) => {
        if (result) {
          await unlinkAsync(`uploads/store/` + result.logo);
          await unlinkAsync(`uploads/store/` + result.government_file);

          await unlinkAsync(`uploads/store/` + result.registeration_file);

          store.deleteOne({ _id: id }, (err, val) => {
            if (!val) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Store has been removed Successfully",
                success: true,
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
const collection = require("../models/collection");
const product = require("../models/product");
exports.addcollection = async (req, res) => {
  try {
    const { store, name } = req.body;
    if (!(store && name)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Collection = new collection(req.body);
      Collection.save().then((item) => {
        res.status(200).send({
          success: true,
          message: "Collection created",
          data: item,
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
exports.addproduct = async (req, res) => {
  try{
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      collection.findOne({ _id: id }, async (err, result) => {        
        
        if (result) {
          await product.updateOne({_id: req.body.product},{collection_name: id})

          res.status(200).send({ message: "Product add successfully", success: true });

        }})
      }
  
  }catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

exports.getcollection = async (req, res) => {
  try{
    const {store} = req.query;
    
    if(!store){
      res.status(200).json({
        success: false,
        message: "Store must be required",
      });  
    }else{
      res.status(200).json({
        success: true,
        message: "Collection fetch successfully",
        data:  await collection.find({store:store})
      });  
     
    }

  }catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}