import type { Request } from "express";
import type { UserDocument } from "@src/models/User.model";
import type { CommentDocument } from "@src/models/Comment.model";
import type { PostDocument } from "@src/models/Post.model";
import type { JwtPayload } from "jsonwebtoken";

export enum LogLevel {
    ERROR = "error",
    WARN = "warn",
    INFO = "info",
    HTTP = "http",
    VERBOSE = "verbose",
    DEBUG = "debug",
    SILLY = "silly",
}

export const colorCode: Record<LogLevel, string> = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "blue",
    silly: "pink",
};

export const levelCode: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

export enum ErrorExposureDepth {
    HTTP = "HTTP",
    BUSINESS = "BUSINESS",
    DATA = "DATA",
    DEFAULT = "DEFAULT",
}

export const errorExposureDepthCode: Record<ErrorExposureDepth, number> = {
    HTTP: 1,
    BUSINESS: 2,
    DATA: 3,
    DEFAULT: Number.MAX_SAFE_INTEGER,
};

export interface ApplicationError extends Error {
    status: number;
    message: string;
    type: string;
    cause?: ApplicationError | Error | null;
    stack?: string;
}

export interface IRegistrationData {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface IPostData {
    description: string;
}

export interface ICommentData {
    description: string;
}

export interface ITokenPayload extends JwtPayload {
    id: string;
    name: string;
    handle: string;
    email: string;
    role: "user" | "moderator" | "admin";
}

export interface IUser {
    id: string;
    name: string;
    handle: string;
    email: string;
    role: "user" | "moderator" | "admin";
}

export interface IVerifiedRequest extends Request {
    user: IUser;
}

export interface IUserUpdateData extends Partial<UserDocument> {
    profilePicture?: Buffer;
}

export interface IPost extends Partial<PostDocument> {}

export interface IComment extends Partial<CommentDocument> {}
