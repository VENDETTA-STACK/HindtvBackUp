var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    Name:String,
    Latitude:Number,
    Longitude:Number,
    Link:String,
});


const admin = mongoose.model("location", newSchema);
module.exports = admin;
