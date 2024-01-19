import type { Request, Response } from "express";
import authService from "@src/services/auth.business";
import { registrationSchema, loginSchema } from "@src/schemas/auth.schema";
import catchAsyncError from "@src/middlewares/catch-async-error.middleware";
import { HttpError, HttpErrors, processValidationError } from "@src/utils/application-errors";

const register = catchAsyncError(async function (req: Request, res: Response) {
    let user;
    try {
        user = await registrationSchema.validateAsync(req.body);
    } catch (error) {
        processValidationError(error);
    }
    
    const { data, accessToken, refreshToken } = await authService.createUser(user);

    res.status(201).json({
        message: "user registration successful",
        profile: data,
        accessToken,
        refreshToken,
    });
});

const login = catchAsyncError(async function (req: Request, res: Response) {
    let user;
    try {
        user = await loginSchema.validateAsync(req.body);
    } catch (error) {
        processValidationError(error);
    }

    const { data, accessToken, refreshToken } = await authService.validateUser({
        email: user.email,
        password: user.password,
    });

    res.status(200).json({
        message: "user login successful",
        profile: data,
        accessToken,
        refreshToken,
    });
});

const refresh = catchAsyncError(async function (req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new HttpError(400, HttpErrors.BAD_REQUEST, "refresh token not provided");

    const { newAccessToken, newRefreshToken } = await authService.refreshUserTokens(refreshToken);

    res.status(201).json({
        message: "tokens refresh successful",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
});

const logout = catchAsyncError(async function (req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new HttpError(400, HttpErrors.BAD_REQUEST, "refresh token not provided");

    const response = await authService.clearUserTokens(refreshToken);

    res.status(200).json({
        message: response,
    });
});

export default { register, login, refresh, logout };
