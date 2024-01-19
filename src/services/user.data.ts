import fs from "fs";
import path from "path";
import client from "@src/configs/cache.config";
import UserModel, { type UserDocument } from "@src/models/User.model";
import mongoose from "mongoose";
import { DataError, DataErrors, catchAsyncDataError, processMongoError } from "@src/utils/application-errors";
import type { IUser, IUserUpdateData } from "@src/types";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const getAllUserRecords = catchAsyncDataError(async function (): Promise<UserDocument[]> {
    let users: UserDocument[] = [];
    try {
        users = await UserModel.find();
    } catch (error) {
        processMongoError(error);
    }

    return users.map((user) => ({
        ...user._doc,
        id: user._id.toString(),
    }));
});

const getUserRecordByID = catchAsyncDataError(async function (id: string): Promise<UserDocument> {
    let user: UserDocument | null = null;

    if (!isValidObjectId(id)) throw new DataError(DataErrors.INVALID_ID, "invalid userId");

    try {
        user = await UserModel.findById(id);
    } catch (error) {
        processMongoError(error);
    }
    if (!user) throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "user not found");

    return {
        ...user._doc,
        id: user._id.toString(),
    };
});

const updateUserRecord = catchAsyncDataError(async function (
    userId: string,
    updatedData: IUserUpdateData,
    file: Express.Multer.File | undefined
): Promise<UserDocument> {
    if (!isValidObjectId(userId)) throw new DataError(DataErrors.INVALID_ID, "invalid userId");

    if (file) {
        updatedData.profilePicture = fs.readFileSync(path.join(__dirname, "../uploads", file.filename));
    }

    let updatedUser: UserDocument | null = null;
    try {
        updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: { ...updatedData } }, { new: true });
    } catch (error) {
        processMongoError(error);
    }

    return {
        ...updatedUser?._doc,
        id: updatedUser?._id.toString(),
    };
});

const updateUserFollowingRecord = catchAsyncDataError(async function (user: IUser, userId: string): Promise<string> {
    if (!isValidObjectId(userId)) throw new DataError(DataErrors.INVALID_ID, "invalid userId");

    let follower: UserDocument | null = null;
    let followed: UserDocument | null = null;

    try {
        follower = await UserModel.findById(user.id);
        followed = await UserModel.findById(userId);
    } catch (error) {
        processMongoError(error);
    }

    if (!follower) throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "follower not found");
    if (!followed) throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "followed not found");

    if (!followed.followers.includes(follower.id)) {
        await followed.updateOne({ $push: { followers: follower.id } });
        await follower.updateOne({ $push: { followings: followed.id } });
        return `you started following ${followed.username}`;
    } else {
        await followed.updateOne({ $pull: { followers: follower.id } });
        await follower.updateOne({ $pull: { followings: followed.id } });
        return `you just unfollowed ${followed.username}`;
    }
});

const deleteUserRecord = catchAsyncDataError(async function (userId: string): Promise<string> {
    if (!isValidObjectId(userId)) throw new DataError(DataErrors.INVALID_ID, "invalid userId");

    try {
        await UserModel.findByIdAndDelete(userId);
    } catch (error) {
        processMongoError(error);
    }

    await client.DEL(`access:${userId}`);
    await client.DEL(`refresh:${userId}`);

    return "user deletion successful";
});

export default { getAllUserRecords, getUserRecordByID, updateUserRecord, updateUserFollowingRecord, deleteUserRecord };
