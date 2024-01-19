import type { Request, Response } from "express";
import userService from "@src/services/user.business";
import catchAsyncError from "@src/middlewares/catch-async-error.middleware";
import type { IVerifiedRequest, IUserUpdateData } from "@src/types";
import { HttpError, HttpErrors } from "@src/utils/application-errors";

const getAllUsers = catchAsyncError(async function (_req: Request, res: Response) {
    const users = await userService.getAllUsers();

    res.status(200).json({ users: users });
});

const getUserByID = catchAsyncError(async function (req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "userId not provided.");

    const user = await userService.getUserByID(userId);

    res.status(200).json({ user: user });
});

const updateUser = catchAsyncError(async function (req: Request, res: Response) {
    const { userId } = req.params;
    const updatedData: IUserUpdateData = req.body.updatedData;

    if (!userId || !updatedData) {
        throw new HttpError(400, HttpErrors.BAD_REQUEST, "userId or updatedData not provided.");
    }

    const user = (req as IVerifiedRequest).user;
    const file = req.file;
    const updatedUser = await userService.updateUser(user, userId, updatedData, file);

    res.status(200).json({ user: updatedUser });
});

const updateBackgroundImage = catchAsyncError(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { updatedData } = req.body;

    if (!userId || !updatedData)
        throw new HttpError(400, HttpErrors.BAD_REQUEST, "userId or updatedData not provided.");

    const user = (req as IVerifiedRequest).user;
    const file = req.file;
    const updatedUser = await userService.updateUser(user, userId, updatedData, file);

    res.status(200).json({ user: updatedUser });
});

const followUser = catchAsyncError(async function (req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "userId not provided.");

    const user = (req as IVerifiedRequest).user;
    const response = await userService.followUser(user, userId);

    res.status(200).json({ message: response });
});

const deleteUser = catchAsyncError(async function (req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "userId not provided.");

    const user = (req as IVerifiedRequest).user;
    const response = await userService.deleteUser(user, userId);

    res.status(200).json({ message: response });
});

export default {
    getAllUsers,
    getUserByID,
    updateUser,
    updateBackgroundImage,
    followUser,
    deleteUser,
};
