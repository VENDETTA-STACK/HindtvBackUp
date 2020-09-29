var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    Name:String,
    SubCompanyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcompany",
        required: true,
      },
      Latitude:Number,
      Longitude:Number,
      Link:String,
});


const admin = mongoose.model("location", newSchema);
module.exports = admin;
