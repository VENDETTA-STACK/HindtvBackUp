var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
    StartDate : Date,
    EndDate : Date,
    Year : Number,
    SubCompanyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "subcompany",
       
    },
    LeaveNumber : Number,
});

module.exports = mongoose.model("defineleave",newSchema);