const express = require('express');
const note = require("../models/note");
const checkAuth = require("../middleware/check-auth");

const Note = require('../models/note');
const Temp = require('../models/tempData');

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    title: req.body.title,
    dateCreated: req.body.dateCreated
  });
  note.save().then(createdNote => {
    Temp.findOneAndUpdate({name: "test"}, {mostRecentNoteId: createdNote._id}).then(result => {
      console.log('saved recent note: ' + createdNote._id);
    })
    res.status(201).json({
      noteId: createdNote._id,
      message: 'Post added successfully'
    });
  });
});

// router.get("/createtest", (req, res, next) => {
//   const temp = new Temp({
//     name: "test",
//     mostRecentNoteId: "none"
//   });
//   temp.save().then(createdtest => {
//     console.log(createdtest)
//   })
// })

router.put("/:id", checkAuth, (req, res, next) => {
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

router.get('', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const noteQuery = Note.find();
  let fetchedNotes;
  if (pageSize && currentPage) {
    noteQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  noteQuery
    .then(documents => {
      fetchedNotes = documents;
      return Note.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Notes fetched successfully!",
        notes: fetchedNotes,
        maxNotes: count
      })
    });
});

router.get('/last', checkAuth, (req, res, next) => {
  Temp.findOne({name: "test"}).then(temp => {
    console.log(temp)
    res.status(200).json(temp.mostRecentNoteId)
  })
});

router.get('/:id', checkAuth, (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({message: "Note not found!"});
    }
  })
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Note.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = router;
