const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("@/src/controllers/user.controller");
const verifyAccessToken = require("@/src/middlewares/token.middleware");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get("/all", userController.getAllUsers);

router.get("/:userId", userController.getUserByID);

router.put("/:userId", verifyAccessToken, upload.single("profilePicture"), userController.updateUser);

router.put("/background-image/:userId", verifyAccessToken, upload.single("backgroundImage"), userController.updateBackgroundImage);

router.put("/follow/:userId", verifyAccessToken, userController.followUser);

router.delete("/:userId", verifyAccessToken, userController.deleteUser);

module.exports = router;
