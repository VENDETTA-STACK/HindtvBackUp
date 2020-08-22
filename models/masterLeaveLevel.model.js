var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  MasterId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto:true,
  },
  MasterName:{
    type:String,
    required:true,
  },
  MasterType:{
    type:String,
    required:true,
  },
  Status:{
    type:String,
    required:true,
  }
});

const admin = mongoose.model("masterLeaveLevel", newSchema);
module.exports = admin;
