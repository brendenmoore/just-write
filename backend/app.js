const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
  next();
})

app.use('/api/notes', (req, res, next) => {
  const notes = [
    {
      id: "fh34798ugfiwe",
      content: "Test Content from server",
      dateCreated: {year: 2021, month: 01, date: 18}
    },
    {
      id: "e465r76ih",
      content: "Test Content from server number 2!",
      dateCreated: {year: 2021, month: 01, date: 17}
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    notes: notes
  });
});

module.exports = app;
