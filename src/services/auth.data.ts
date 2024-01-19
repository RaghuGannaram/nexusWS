import bcrypt from "bcryptjs";
import UserModel, { type UserDocument } from "@src/models/User.model";
import { DataError, DataErrors, catchAsyncDataError, processMongoError } from "@src/utils/application-errors";
import type { IRegistrationData, ILoginData } from "@src/types";

const createUserRecord = catchAsyncDataError(async function (user: IRegistrationData): Promise<UserDocument> {
    const salt = await bcrypt.genSalt(10);
    if (!salt) throw new DataError(DataErrors.CRYPTOGRAPHIC_ERROR, "salt generation failed");

    user.password = await bcrypt.hash(user.password, salt);
    if (!user.password) throw new DataError(DataErrors.CRYPTOGRAPHIC_ERROR, "password hashing failed");

    const newUserInstance = new UserModel(user);
    let newUser: UserDocument;

    try {
        newUser = await newUserInstance.save();
    } catch (error) {
        processMongoError(error);
    }

    return {
        ...newUser._doc,
        id: newUser._id.toString(),
    };
});

const readUserRecord = catchAsyncDataError(async function (userCredentials: ILoginData): Promise<UserDocument> {
    const { email, password } = userCredentials;
    
    const user = await UserModel.findOne({ email: email });
    if (!user) throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "user not found");

    const verified = await bcrypt.compare(password, user.password);
    if (!verified) throw new DataError(DataErrors.INVALID_PASSWORD, "password verification failed");

    return {
        ...user._doc,
        id: user._id.toString(),
    };
});

export default { createUserRecord, readUserRecord };
