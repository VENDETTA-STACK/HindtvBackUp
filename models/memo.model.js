var mongoose = require("mongoose");

var newSchema = mongoose.Schema({
  Eid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  Hour: String,
  Minutes: String,
  Seconds: String,
  Status: Boolean,
});

const memo = mongoose.model("memo", newSchema);

module.exports = memo;
