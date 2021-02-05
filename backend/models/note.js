const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  content: { type: String, required: false },
  title: { type: String, required: false },
  dateCreated: {type: {year: Number, month: Number, date: Number, string: String}, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }
});

module.exports = mongoose.model('Note', noteSchema);
