const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Auth0User = require("../models/auth0user");

exports.createUser = (req, res, next) => {
  const existingUser = Auth0User.findById(req.user.sub).then(
    (onFulfilled, onRejected) => {
      onFulfilled(() => {
        res.sendStatus(200);
      });
      onRejected(() => {
        const user = new Auth0User({
          _id: req.user.sub,
          goal: 750,
        });
        user
          .save()
          .then((result) => {
            res.status(201).json({
              message: "User Created",
              result: result,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: "Error creating user",
              error: err,
            });
          });
      });
    }
  );
};

exports.getUser = (req, res, next) => {
  Auth0User.findById(req.user.sub).then((user) => {
    if (user) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  });
};

exports.getGoal = (req, res, next) => {
  console.log(req.user.sub);
  Auth0User.findById(req.user.sub)
    .then((user) => {
      if (user.goal) {
        res.status(200).json({ goal: user.goal });
      } else {
        User.findByIdAndUpdate(req.use.sub, { goal: 750 }).then((result) => {
          res.status(200).json({ goal: 750 });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching goal failed!",
      });
    });
};

exports.setGoal = (req, res, next) => {
  Auth0User.findByIdAndUpdate(req.user.sub, { goal: req.params.goal })
    .then((result) => {
      if (result.goal) {
        res.status(200).json({ goal: result.goal });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update goal",
      });
    });
};
