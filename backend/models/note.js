const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  content: { type: String, required: false },
  title: { type: String, required: false },
  dateCreated: {type: {year: Number, month: Number, date: Number, string: String}, required: false},
  date: {type: Number, required: false},
  creator: {type: String, ref: "Auth0User", required: true, }
});

module.exports = mongoose.model('Note', noteSchema);
