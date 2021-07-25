const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
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
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed: user not found",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1y" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 1,
        userId: fetchedUser._id,
        userEmail: fetchedUser.email,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Error Logging in",
        error: err,
      });
    });
};

exports.getGoal = (req, res, next) => {
  console.log(req.userData.userId);
  User.findById(req.userData.userId)
    .then((user) => {
      if (user.goal) {
        res.status(200).json({goal: user.goal});
      } else {
        User.findByIdAndUpdate(req.userData.userId, {goal: 750}).then(result => {
          res.status(200).json({ goal: 750 });
        })
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching goal failed!",
      });
    });
};

exports.setGoal = (req, res, next) => {
  User.findByIdAndUpdate(req.userData.userId, { goal: req.params.goal })
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
