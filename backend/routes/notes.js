const express = require('express');
const NoteController = require("../controllers/notes")
const checkAuth = require("../middleware/check-auth");
const jwtCheck = require("../middleware/jwt-check");
const updateDates = require("../middleware/updateDates");


const router = express.Router();

router.get("/updateDates", updateDates);

router.post("", jwtCheck, NoteController.createNote);

router.put("/:id", jwtCheck, NoteController.updateNote)

router.get('', jwtCheck, NoteController.fetchNotes);

router.get("/:id", jwtCheck, NoteController.getNoteById);

router.delete("/:id", jwtCheck, NoteController.deleteNote);

module.exports = router;
