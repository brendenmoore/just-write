const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Note = require('./models/note');

const app = express();

mongoose.connect("mongodb+srv://brendenm17:8KaNR5Tl5iYpwkcX@cluster0.c6jzx.mongodb.net/justwrite?retryWrites=true&w=majority")
  .then(() => {
    console.log("connected to database!")
  })
  .catch(() => {
    console.log("connection failed.")
  })

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
  next();
});

app.post("/api/notes", (req, res, next) => {
  const note = new Note({
    content: req.body.content,
    title: req.body.title,
    dateCreated: req.body.dateCreated
  });
  note.save();
  console.log(note);

  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/notes', (req, res, next) => {
  Note.find()
    .then(documents => {
      console.log(documents);
      res.status(200).json({
        message: 'Notes fetched successfully!',
        notes: documents
      });
    });
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({message: 'Post deleted!'});
  });
});

module.exports = app;
