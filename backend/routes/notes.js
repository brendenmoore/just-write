const express = require('express');
const NoteController = require("../controllers/notes")
const checkAuth = require("../middleware/check-auth");
const updateDates = require("../middleware/updateDates");


const router = express.Router();

router.get("/updateDates", updateDates);

router.post("", checkAuth, NoteController.createNote);

router.put("/:id", checkAuth, NoteController.updateNote)

router.get('', checkAuth, NoteController.fetchNotes);

router.get('/:id', checkAuth, NoteController.getNoteById);

router.delete("/:id", checkAuth, NoteController.deleteNote);

module.exports = router;
