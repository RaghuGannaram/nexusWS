import userData from "./user.data";
import hideSensitiveInfo from "@src/utils/hide-sensitive-info";
import { BusinessError, BusinessErrors, catchAsyncBusinessError } from "@src/utils/application-errors";
import type { IUser, IUserUpdateData } from "@src/types";

const getAllUsers = catchAsyncBusinessError(async function () {
    const users = await userData.getAllUserRecords();

    return users.map((user) => {
        return hideSensitiveInfo(user, "password", "email", "role", "updatedAt", "__v", "_id");
    });
});

const getUserByID = catchAsyncBusinessError(async function (userId: string) {
    const user = await userData.getUserRecordByID(userId);

    return hideSensitiveInfo(user, "password", "email", "role", "updatedAt", "__v", "_id");
});

const updateUser = catchAsyncBusinessError(async function (
    user: IUser,
    userId: string,
    updatedData: IUserUpdateData,
    file: Express.Multer.File | undefined
) {
    if (user.role !== "admin" && user.id !== userId)
        throw new BusinessError(BusinessErrors.UNAUTHORIZED_ACCESS, "You can update only your account!");

    Object.keys(updatedData).forEach((key) => {
        const value = (updatedData as any)[key];
        if (value === undefined || value === "undefined") {
            delete (updatedData as any)[key];
        }
    });

    const updatedUser = await userData.updateUserRecord(userId, updatedData, file);

    return hideSensitiveInfo(updatedUser, "password", "updatedAt", "__v", "_id");
});

const followUser = catchAsyncBusinessError(async function (user: IUser, userId: string) {
    if (user.id === userId) throw new BusinessError(BusinessErrors.LOGICAL_ERROR, "You can't follow yourself");

    const response = await userData.updateUserFollowingRecord(user, userId);

    return response;
});

const deleteUser = catchAsyncBusinessError(async function (user: IUser, userId: string) {
    if (user.role !== "admin" && user.id !== userId)
        throw new BusinessError(BusinessErrors.UNAUTHORIZED_ACCESS, "You can delete only your account!");

    const response = await userData.deleteUserRecord(userId);

    return response;
});

export default {
    getAllUsers,
    getUserByID,
    updateUser,
    followUser,
    deleteUser,
};
