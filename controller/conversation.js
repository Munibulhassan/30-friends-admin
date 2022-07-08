const router = require("express").Router();
const conversation = require("../models/conversation");
// new conversation

//get conversation
exports.getconversations = async (req, res) => {
  try {
    req.user._id = '62bae0669d06819393340ceb'
    
    const data = await conversation.find({
      members: { $in: [req.user._id] },
    });
    

    if (data.length > 0) {
      res.status(200).json({
        success: true,
        data: data,
        message: "Conversation fetch Successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No any conversation exist",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

