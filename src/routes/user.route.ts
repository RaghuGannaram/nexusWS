import express, { type Router, type Request } from "express";
import multer from "multer";
import path from "path";
import userController from "@src/controllers/user.controller";
import authenticate from "@src/middlewares/auth.middleware";

const storage = multer.diskStorage({
    destination: function (_req: Request, _file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (_req: Request, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const router: Router = express.Router();

router.get("/all", userController.getAllUsers);

router.get("/:userId", userController.getUserByID);

router.put("/:userId", authenticate, upload.single("profilePicture"), userController.updateUser);

router.put(
    "/background-image/:userId",
    authenticate,
    upload.single("backgroundImage"),
    userController.updateBackgroundImage
);

router.put("/follow/:userId", authenticate, userController.followUser);

router.delete("/:userId", authenticate, userController.deleteUser);

export default router;
