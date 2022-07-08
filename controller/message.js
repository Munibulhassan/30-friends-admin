
const Message = require("../models/message");
exports.createmessage =  async (req, res) => {
  try {
    const { conversationId, sender } = req.body;
    
    if (!(conversationId && sender )) {
      res.status(201).json({
        success: false,
        message: "All input is required",
      });
    } else {
      if(req.body.text){
      const message = new Message({
        conversationId:conversationId,
        sender:sender,
        text:req.body.text
      });

      await message.save();}

      req.files.map(async (item,index)=>{
        req.body.image = item.filename;
        const message = new Message({
          conversationId:conversationId,
          sender:sender,
          image : item.filename
        });
        await message.save();
      
        
      })
      res.status(200).json({
        success: true,
        
        message: "message sent successfully ",
      });
      
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getmessage =  async (req, res) => {
    try {
      const data = await Message.find({
        conversationId: req.params.conversationId
      });
      if (data.length > 0) {
        res.status(200).json({
          success: true,
          data: data,
            message: "Messages fetch Successfully",
        });
      } else {
        res.status(200).json({
          success: false,
          message: "No any messages exist",
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };

  exports.deletemessage = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(200).send({ message: "id is not specify", success: false });
      } else {
        Message.findOne({ _id: id }, async (err, result) => {
          if (req?.user?._id != result?.vendor) {
            res.status(200).send({
              message: "Only Vendor of this message can update message details",
              success: false,
            });
          } else if (result) {
            await unlinkAsync(`uploads/message/` + result.image);
            
            Message.deleteOne({ _id: id }, (err, val) => {
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