var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Eid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  Date: String,
  Hour: String,
  Minutes: String,
  Seconds: String,
  Status: Boolean,
  Type: String,
  Reason: String,
});

const memo = mongoose.model("memo", newSchema);

module.exports = memo;
