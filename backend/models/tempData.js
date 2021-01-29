const mongoose = require("mongoose");

const tempSchema = mongoose.Schema({
  name: {type: String, required: true},
  mostRecentNoteId: { type: String, required: true },
});

module.exports = mongoose.model('Temp', tempSchema);
