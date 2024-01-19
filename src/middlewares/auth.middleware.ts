import type { Request, Response, NextFunction } from "express";
import { validateAccessToken } from "@src/services/token.service";
import { HttpError, HttpErrors } from "@src/utils/application-errors";
import catchAsyncError from "./catch-async-error.middleware";
import type { IUser, IVerifiedRequest } from "@src/types";

const authenticate = catchAsyncError(async (req: Request, _res: Response, next: NextFunction) => {
    let accessToken = req.headers["authorization"];

    if (!accessToken) throw new HttpError(401, HttpErrors.UNAUTHORIZED, "Access token not provided");

    if (!accessToken.startsWith("Bearer "))
        throw new HttpError(401, HttpErrors.UNAUTHORIZED, "Invalid authorization scheme.");

    accessToken = accessToken.slice(7);

    const decoded = await validateAccessToken(accessToken);

    const user: IUser = {
        id: decoded.id,
        name: decoded.name,
        handle: decoded.handle,
        email: decoded.email,
        role: decoded.role,
    };

    (req as IVerifiedRequest).user = user;

    next();
});

export default authenticate;
