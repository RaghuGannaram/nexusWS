import authData from "@src/services/auth.data";
import { issueAccessToken, issueRefreshToken, validateRefreshToken } from "@src/services/token.service";
import client from "@src/configs/cache.config";
import hideSensitiveInfo from "@src/utils/hide-sensitive-info";
import { catchAsyncBusinessError } from "@src/utils/application-errors";
import type { IRegistrationData, ILoginData, ITokenPayload } from "@src/types";

const createUser = catchAsyncBusinessError(async function (user: IRegistrationData) {
    let response = await authData.createUserRecord(user);

    const safeResponse = hideSensitiveInfo(response, "password", "updatedAt", "__v", "_id");

    const payload: ITokenPayload = {
        id: response.id,
        name: response.firstname + " " + response.lastname,
        handle: response.username,
        email: response.email,
        role: response.role,
    };

    const accessToken = await issueAccessToken(payload);
    const refreshToken = await issueRefreshToken(payload);

    return { data: safeResponse, accessToken, refreshToken };
});

const validateUser = catchAsyncBusinessError(async function ({ email, password }: ILoginData) {
    const user = await authData.readUserRecord({ email, password });

    const safeResponse = hideSensitiveInfo(user, "password", "updatedAt", "__v", "_id");

    const payload: ITokenPayload = {
        id: user.id,
        name: user.firstname + " " + user.lastname,
        handle: user.username,
        email: user.email,
        role: user.role,
    };

    const accessToken = await issueAccessToken(payload);
    const refreshToken = await issueRefreshToken(payload);

    return { data: safeResponse, accessToken, refreshToken };
});

const refreshUserTokens = catchAsyncBusinessError(async function (refreshToken: string) {
    const user = await validateRefreshToken(refreshToken);

    const newAccessToken = await issueAccessToken(user);
    const newRefreshToken = await issueRefreshToken(user);

    return { newAccessToken, newRefreshToken };
});

const clearUserTokens = catchAsyncBusinessError(async function (refreshToken: string) {
    const user = await validateRefreshToken(refreshToken);

    await client.DEL(`access:${user.id}`);
    await client.DEL(`refresh:${user.id}`);

    return "user logout successful";
});

export default { createUser, validateUser, refreshUserTokens, clearUserTokens };
