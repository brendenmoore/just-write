const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  _id: { type: String },
  last: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: false },
  goal: { type: Number, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Auth0User", userSchema);
