const express = require('express');
const NoteController = require("../controllers/notes")
const checkAuth = require("../middleware/check-auth");


const router = express.Router();

router.post("", checkAuth, NoteController.createNote);

router.put("/:id", checkAuth, NoteController.updateNote)

router.get('', checkAuth, NoteController.fetchNotes);

router.get('/last', checkAuth, NoteController.getLastNote);

router.get('/:id', checkAuth, NoteController.getNoteById);

router.delete("/:id", checkAuth, NoteController.deleteNote);

module.exports = router;
