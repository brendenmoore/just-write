const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const notesRoutes = require("./routes/notes");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect("mongodb+srv://brendenm17:" + process.env.MONGO_ATLAS_PW + "@cluster0.c6jzx.mongodb.net/justwrite2?retryWrites=true&w=majority")
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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  next();
});

app.get("/health", (req, res, next) => {
  console.log("here");
  return res.status(200).json({message: "ok"})
})
app.use("/api/notes", notesRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
