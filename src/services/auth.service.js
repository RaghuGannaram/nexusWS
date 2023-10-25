const bcrypt = require("bcryptjs");
const User = require("@/src/models/User.model");
const client = require("@/src/configs/cache.config");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("@/src/utils/sign-token");
const hideSensitiveInfo = require("@/src/utils/hide-sensitive-info");
const CustomError = require("@/src/utils/custom-error");

const createUser = async function (user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const newUser = new User(user);
    const response = await newUser.save();

    response._doc.id = response._id.toString();
    const formattedResponse = hideSensitiveInfo(response._doc, "password", "updatedAt", "__v", "_id");

    const accessToken = await signAccessToken(formattedResponse);
    const refreshToken = await signRefreshToken(formattedResponse);

    return { data: formattedResponse, accessToken, refreshToken };
};

const validateUser = async function (email, password) {
    const user = await User.findOne({ email: email });
    if (!user) throw new CustomError("Unauthorized", 401, "AUTHENTICATION_ERROR", "username or password not valid");

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new CustomError("Unauthorized", 401, "AUTHENTICATION_ERROR", "username or password not valid");

    user._doc.id = user._id.toString();
    const formattedResponse = hideSensitiveInfo(user._doc, "password", "updatedAt", "__v", "_id");

    const accessToken = await signAccessToken(formattedResponse);
    const refreshToken = await signRefreshToken(formattedResponse);

    return { data: formattedResponse, accessToken, refreshToken };
};

const refreshUserTokens = async function (refreshToken) {
    const user = await verifyRefreshToken(refreshToken);

    const newAccessToken = await signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);

    return { newAccessToken, newRefreshToken };
}

const clearUserTokens = async function (refreshToken) {
    const user = await verifyRefreshToken(refreshToken);

    await client.DEL(`access:${user.id}`);
    await client.DEL(`refresh:${user.id}`);
}

module.exports = { createUser, validateUser, refreshUserTokens, clearUserTokens };
