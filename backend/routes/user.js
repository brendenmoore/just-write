const express = require('express');

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/goal", checkAuth, UserController.getGoal);

router.post("/goal/:goal", checkAuth, UserController.setGoal)

module.exports = router;
