const User = require('../models/auth0user');
const Note = require('../models/note');

exports.createNote = (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    title: req.body.title,
    date: req.body.date,
    creator: req.user.sub
  });
  note.save().then(createdNote => {
    res.status(201).json({
      note: createdNote,
      noteId: createdNote._id,
      message: 'Post added successfully'
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a note failed: " + error
    })
  });
}

exports.updateNote = (req, res, next) => {
  const note = new Note({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    date: req.body.date
  });
  Note.updateOne({_id: req.params.id, creator: req.user.sub }, note).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Updated Note"});
    }
    else {
      res.status(401).json({message: "Not authorized"});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Couldn't update post"
    })
  });
}

exports.fetchNotes = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const noteQuery = Note.find( {creator: req.user.sub} );
  let fetchedNotes;
  if (pageSize && currentPage) {
    noteQuery
      .sort('-date')
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  noteQuery
    .then(documents => {
      fetchedNotes = documents;
      return Note.count({creator: req.user.sub});
    })
    .then(count => {
      res.status(200).json({
        message: "Notes fetched successfully!",
        notes: fetchedNotes,
        maxNotes: count
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching notes failed!"
      })
    });
}

exports.getNoteById = (req, res, next) => {
  Note.findOne({_id: req.params.id, creator: req.user.sub}).then(note => {
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({message: "Note not found!"});
    }
  })
  .catch(error => {
      res.status(500).json({
        message: "Fetching note failed!"
      })
    });
}

exports.deleteNote = (req, res, next) => {
  Note.deleteOne({_id: req.params.id, creator: req.user.sub}).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Deleted Note"});
    } else {
      res.status(401).json({message: "Not authorized"});
    }
  });
}
