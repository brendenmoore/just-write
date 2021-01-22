const express = require('express');

const Note = require('../models/note');

const router = express.Router();

router.post("", (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    title: req.body.title,
    dateCreated: req.body.dateCreated
  });
  note.save().then(createdNote => {
    res.status(201).json({
      noteId: createdNote._id,
      message: 'Post added successfully'
    });
  });
});

router.put("/:id", (req, res, next) => {
  const note = new Note({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    dateCreated: req.body.dateCreated
  });
  Note.updateOne({_id: req.params.id}, note).then(result => {
    res.status(200).json({message: "Updated Note"});
  })
})

router.get('', (req, res, next) => {
  Note.find()
    .then(documents => {
      res.status(200).json({
        message: 'Notes fetched successfully!',
        notes: documents
      });
    });
});

router.get('/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({message: "Note not found!"});
    }
  })
})

router.delete("/:id", (req, res, next) => {
  Note.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = router;
