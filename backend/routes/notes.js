const express = require('express');
const checkAuth = require("../middleware/check-auth");

const User = require('../models/user');
const Note = require('../models/note');

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    title: req.body.title,
    dateCreated: req.body.dateCreated,
    creator: req.userData.userId
  });
  note.save().then(createdNote => {
    User.findByIdAndUpdate(req.userData.userId, {last: createdNote._id}).then(result => {
      console.log('saved recent note: ' + createdNote._id);
    })
    res.status(201).json({
      noteId: createdNote._id,
      message: 'Post added successfully'
    });
  });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const note = new Note({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    dateCreated: req.body.dateCreated
  });
  Note.updateOne({_id: req.params.id, creator: req.userData.userId }, note).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Updated Note"});
    }
    else {
      console.log(result)
      res.status(401).json({message: "Not authorized"});
    }
  })
})

router.get('', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const noteQuery = Note.find( {creator: req.userData.userId} );
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
  User.findById(req.userData.userId).then(user => {
    console.log(user)
    if (user.last) {
      console.log('success?')
      res.status(200).json({message:"note id found successfully", noteId: user.last});
    }
    else {
      console.log('none found')
      res.status(404).json({message: "no last note saved", noteId: null});
    }
  })
});

router.get('/:id', checkAuth, (req, res, next) => {
  Note.findOne({_id: req.params.id, creator: req.userData.userId}).then(note => {
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({message: "Note not found!"});
    }
  })
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Note.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Deleted Note"});
    }
    res.status(401).json({message: "Not authorized"});
  });
});

module.exports = router;
