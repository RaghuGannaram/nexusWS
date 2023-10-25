const fs = require("fs");
const path = require("path");
const User = require("@/src/models/User.model");
const client = require("@/src/configs/cache.config");
const hideSensitiveInfo = require("@/src/utils/hide-sensitive-info");
const CustomError = require("@/src/utils/custom-error");

const getAllUsers = async function () {
    const users = await User.find();

    return users.map((user) => {
        user._doc.id = user._id.toString();
        return hideSensitiveInfo(user._doc, "password", "email", "role", "updatedAt", "__v", "_id");
    });
};

const getUserByID = async function (id) {
    const user = await User.findById(id);

    user._doc.id = user._id.toString();
    return hideSensitiveInfo(user._doc, "password", "email", "role", "updatedAt", "__v", "_id");
};

const updateUser = async function (user, userId, updatedData, file) {
    if (user.role !== "admin" && user.id !== userId) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You can update only your account!");

    Object.keys(updatedData).forEach((key) => updatedData[key] === "undefined" && delete updatedData[key]);

    if (file) {
        updatedData.profilePicture = fs.readFileSync(path.join(__dirname, "../uploads", file.filename));
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { ...updatedData } }, { new: true });

    updatedUser._doc.id = updatedUser._id.toString();
    return hideSensitiveInfo(updatedUser._doc, "password", "updatedAt", "__v", "_id");
};

const updateBackgroundImage = async function (user, userId, updatedData, file) {
    if (user.role !== "admin" && user.id !== userId) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You can update only your account!");

    Object.keys(updatedData).forEach((key) => updatedData[key] === "undefined" && delete updatedData[key]);
    if (file) {
        updatedData.backgroundImage = fs.readFileSync(path.join(__dirname, "../uploads", file.filename));
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { ...updatedData } });

    updatedUser._doc.id = updatedUser._id.toString();
    return hideSensitiveInfo(updatedUser._doc, "password", "updatedAt", "__v", "_id");
};

const followUser = async function (user, userId) {
    if (user.id === userId) throw new CustomError("Conflict", 409, "LOGICAL_ERROR", "You can't follow yourself");

    const follower = await User.findById(user.id);
    const followed = await User.findById(userId);

    if (!followed.followers.includes(follower.id)) {
        await followed.updateOne({ $push: { followers: follower.id } });
        await follower.updateOne({ $push: { followings: followed.id } });
        return `You started following ${followed.username}`;
    } else {
        await followed.updateOne({ $pull: { followers: follower.id } });
        await follower.updateOne({ $pull: { followings: followed.id } });
        return `You just unfollowed ${followed.username}`;
    }
};

const deleteUser = async function (user, userId) {
    if (user.role !== "admin" && user.id !== userId) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You can delete only your account!");

    await User.findByIdAndDelete(userId);

    await client.DEL(`access:${userId}`);
    await client.DEL(`refresh:${userId}`);

    return;
};


module.exports = {
    getAllUsers,
    getUserByID,
    updateUser,
    updateBackgroundImage,
    followUser,
    deleteUser,
};
