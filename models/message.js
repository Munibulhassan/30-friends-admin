
const mongoose = require('mongoose')

const Message = new mongoose.Schema({
    conversationId:String,
    sender:String,
    text:String,
    image: String
},{
    
    timestamps:true
})
module.exports = mongoose.model('Message', Message)