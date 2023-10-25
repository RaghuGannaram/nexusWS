const express = require("express");
const authController = require("@/src/controllers/auth.controller");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh-token", authController.refresh);

router.delete("/logout", authController.logout);

module.exports = router;
