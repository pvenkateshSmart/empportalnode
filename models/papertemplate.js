const mongoose = require('mongoose')
//var shortHash = require('short-hash');

const Papertemplate = new mongoose.Schema({
    
    Model: {
    type: String,
    },
    Type: {
    type: String,
    },
    Typeid:{
        type:String
    },
    Tag: {
        type: String,
        },
    Subject:{
        type: String,
    },
    Subjectid:{
        type:String,
    },
    Noofques:{
        type:String,
    },
    Time:{
        type:String,
    },
    Reviewer_branch: {
        type: String,
    },  
    Reviewer_name: {
        type: String,
    },
    Reviewer_paycode: {
        type: String,
    },
    Papersetter_branch: {
        type: String,
    },  
    Papersetter_name: {
        type: String,
    },
    Task:{
        type: String,
    },
    Papersetter_paycode: {
        type: String,
    },
    Status:{
        type:String
    },
    Statuscode:{
        type:Number
    },
    Qids:{
        type:Object
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    time : { type : Date, default: Date.now }
})

module.exports = mongoose.model('Papertemplate',Papertemplate,'Papertemplate')
