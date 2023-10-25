const userService = require("@/src/services/user.service");
const catchAsyncError = require("@/src/middlewares/catch-async-error.middleware");
const CustomError = require("@/src/utils/custom-error");

const getAllUsers = catchAsyncError(async function (req, res) {
    const users = await userService.getAllUsers();

    res.status(200).json({ users: users });
});

const getUserByID = catchAsyncError(async function (req, res) {
    const { userId } = req.params;
    if (!userId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "userId not provided.");

    const user = await userService.getUserByID(userId);

    res.status(200).json({ user: user });
});

const updateUser = catchAsyncError(async function (req, res, next) {
    const { userId } = req.params;
    const { updatedData } = req.body;

    if (!userId || !updatedData) {
        throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "userId or updatedData not provided.");
    }

    const user = req.user;
    const file = req.file;
    const updatedUser = await userService.updateUser(user, userId, updatedData, file);

    res.status(200).json({ user: updatedUser });
});

const updateBackgroundImage = catchAsyncError(async (req, res) => {
    const { userId } = req.params;
    const { updatedData } = req.body;

    if (!userId || !updatedData) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "userId or updatedData not provided.");

    const user = req.user;
    const file = req.file;
    const updatedUser = await userService.updateBackgroundImage(user, userId, updatedData, file);

    res.status(200).json({ user: updatedUser });
});

const followUser = catchAsyncError(async function (req, res) {
    const { userId } = req.params;
    if (!userId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "userId not provided.");

    const user = req.user;
    const response = await userService.followUser(user, userId);

    res.status(200).json({ message: response });
});

const deleteUser = catchAsyncError(async function (req, res, next) {
    const { userId } = req.params;
    if (!userId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "userId not provided.");

    const user = req.user;
    await userService.deleteUser(user, userId);

    res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
    getAllUsers,
    getUserByID,
    updateUser,
    updateBackgroundImage,
    followUser,
    deleteUser
};
