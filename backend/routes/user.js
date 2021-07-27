const express = require("express");

const UserController = require("../controllers/auth0user");
const jwtCheck = require("../middleware/jwt-check");

const router = express.Router();

router.get("/goal", jwtCheck, UserController.getGoal);

router.get("/", jwtCheck, UserController.getUser)

router.post("/register", jwtCheck, UserController.createUser)

router.post("/goal/:goal", jwtCheck, UserController.setGoal);

router.get("/testAuth0", jwtCheck, (req, res, next) => {
  console.log(req.user.sub);
  res.send({ message: "Secured Resource" });
});

module.exports = router;
