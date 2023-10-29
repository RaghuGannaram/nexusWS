const authService = require("@/src/services/auth.service");
const { registrationSchema, loginSchema } = require("@/src/schemas/auth.schema");
const catchAsyncError = require("@/src/middlewares/catch-async-error.middleware");
const CustomError = require("@/src/utils/custom-error");

const register = catchAsyncError(async function (req, res) {
    const user = await registrationSchema.validateAsync(req.body);

    const { data, accessToken, refreshToken } = await authService.createUser(user);

    res.status(201).json({
        message: "User registered successfully..!",
        profile: data,
        accessToken,
        refreshToken,
    });
});

const login = catchAsyncError(async function (req, res) {
    const user = await loginSchema.validateAsync(req.body);

    const { data, accessToken, refreshToken } = await authService.validateUser(user.email, user.password);

    res.status(200).json({
        message: "User logged in successfully..!",
        profile: data,
        accessToken,
        refreshToken,
    });
});

const refresh = catchAsyncError(async function (req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "Refresh token not provided.");

    const { newAccessToken, newRefreshToken } = await authService.refreshUserTokens(refreshToken);

    res.status(201).json({
        message: "Tokens refreshed successfully..!",
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    });
});

const logout = catchAsyncError(async function (req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "Refresh token not provided.");

    await authService.clearUserTokens(refreshToken);

    res.status(200).json({
        message: "User logged out successfully..!",
    });
});

module.exports = { register, login, refresh, logout };
