var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Name:{
    type:String,
    required:true,
  },
  SubCompany:{
    type:String,
    required:true,
  },
  Company:{
    type:String,
    required:true,
  },
  Descriptionn:{

  }
});

const admin = mongoose.model("leave", newSchema);
module.exports = admin;
