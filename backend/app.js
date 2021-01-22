const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const notesRoutes = require("./routes/notes");

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  next();
});

app.use("/api/notes", notesRoutes);

module.exports = app;
