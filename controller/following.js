const following = require("../models/following.js");
exports.addfollow = async (req, res) => {
  try {
    const { vendor } = req.body;

    if (!vendor) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      following.findOne({ vendor: vendor, user: req.user._id }, (err, result) => {
          
        if (result) {
          following.deleteOne({ _id: result._id }, (err, val) => {
            res.status(200).send({
              message: "You Successfully Unfollow the vnedor",
              success: true,
            });
          });
        } else {
          req.body.user = req.user._id;
          const Following = new following(req.body);
          Following.save().then((item) => {
            res.status(200).send({
              message: "You Successfully follow the vnedor",
              data: item,
              success: true,
            });
          });
        }
      });
    }
  } catch (err) {
    res.status(200).json({ success: false, message: err.message });
  }
};

exports.getfollowing = async (req, res) => {
  try {
    const data = await following.find({user:req.user._id}).populate({path:"vendor"}).exec()
    
        res.status(200).send({
          message: "You Successfully get your following vnedors",
          data: data,
          success: true,
        });
    
  } catch (err) {
    res.status(200).json({ success: false, message: err.message });
  }
};
