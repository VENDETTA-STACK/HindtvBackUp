var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    EmployeeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "employees",
        required: true,
      },
      Date:Date,
      Time:Date,
      Latitude:Number,
      Longitude:Number,
});


const admin = mongoose.model("gpstracking", newSchema);
module.exports = admin;
