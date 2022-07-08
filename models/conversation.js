const mongoose = require('mongoose')

const conversation = new mongoose.Schema({
    members:[]


},{
    timestamps:true
})
module.exports = mongoose.model('conversation', conversation)
