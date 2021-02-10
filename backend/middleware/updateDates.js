const Note = require("../models/note")

module.exports = (req, res, next) => {
  Note.find().then(result => {
    res.status(200).json({
      message: "it works!",
      note: result
  })
  })

}
