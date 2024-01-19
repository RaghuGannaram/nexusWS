export enum DataErrors {
    DUPLICATE_EMAIL_NOT_ALLOWED = "DUPLICATE_EMAIL_NOT_ALLOWED",
    DUPLICATE_USERNAME_NOT_ALLOWED = "DUPLICATE_USERNAME_NOT_ALLOWED",
    DUPLICATE_RECORDS_NOT_ALLOWED = "DUPLICATE_RECORDS_NOT_ALLOWED",
    DB_RECORD_NOT_FOUND = "DB_RECORD_NOT_FOUND",
    DB_WRITE_OPERATION_FAILED = "DB_WRITE_OPERATION_FAILED",
    DB_EXECUTION_INTERRUPTED = "DB_EXECUTION_INTERRUPTED",
    DB_INTERNAL_ERROR = "DB_INTERNAL_ERROR",
    CACHE_READ_WRITE_ERROR = "CACHE_READ_WRITE_ERROR",
    CRYPTOGRAPHIC_ERROR = "CRYPTOGRAPHIC_ERROR",
    INVALID_ID = "INVALID_ID",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    INVALID_TOKEN = "INVALID_TOKEN",
    INVALID_TOKEN_FORMAT = "INVALID_TOKEN_FORMAT",
    INVALID_TOKEN_SIGNATURE = "INVALID_TOKEN_SIGNATURE",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    TOKEN_NOT_ACTIVE = "TOKEN_NOT_ACTIVE",
    UNKNOWN_DATA_ERROR = "UNKNOWN_DATA_ERROR",
}

export enum BusinessErrors {
    VALIDATION_FAILURE = "VALIDATION_FAILURE",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    DATA_INTEGRITY_ERROR = "DATA_INTEGRITY_ERROR",
    UNAUTHENTICATED_ACCESS = "UNAUTHENTICATED_ACCESS",
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
    EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED",
    USERNAME_ALREADY_TAKEN = "USERNAME_ALREADY_TAKEN",
    TOKEN_ISSUE_ERROR = "TOKEN_ISSUE_ERROR",
    TOKEN_VALIDATION_ERROR = "TOKEN_VALIDATION_ERROR",
    LOGICAL_ERROR = "LOGICAL_ERROR",
    OTHER_DATA_ERROR = "OTHER_DATA_ERROR",
    UNKNOWN_BUSINESS_ERROR = "UNKNOWN_BUSINESS_ERROR",
}

export enum HttpErrors {
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
    REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
    CONFLICT = "CONFLICT",
    TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    BAD_GATEWAY = "BAD_GATEWAY",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    GATEWAY_TIMEOUT = "GATEWAY_TIMEOUT",
}

export enum HttpErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

export const BusinessErrorMap: Record<DataErrors, BusinessErrors> = {
    [DataErrors.DUPLICATE_EMAIL_NOT_ALLOWED]: BusinessErrors.EMAIL_ALREADY_REGISTERED,
    [DataErrors.DUPLICATE_USERNAME_NOT_ALLOWED]: BusinessErrors.USERNAME_ALREADY_TAKEN,
    [DataErrors.DUPLICATE_RECORDS_NOT_ALLOWED]: BusinessErrors.DATA_INTEGRITY_ERROR,
    [DataErrors.DB_RECORD_NOT_FOUND]: BusinessErrors.ENTITY_NOT_FOUND,
    [DataErrors.DB_WRITE_OPERATION_FAILED]: BusinessErrors.OTHER_DATA_ERROR,
    [DataErrors.DB_EXECUTION_INTERRUPTED]: BusinessErrors.OTHER_DATA_ERROR,
    [DataErrors.DB_INTERNAL_ERROR]: BusinessErrors.OTHER_DATA_ERROR,
    [DataErrors.CACHE_READ_WRITE_ERROR]: BusinessErrors.OTHER_DATA_ERROR,
    [DataErrors.CRYPTOGRAPHIC_ERROR]: BusinessErrors.OTHER_DATA_ERROR,
    [DataErrors.INVALID_ID]: BusinessErrors.ENTITY_NOT_FOUND,
    [DataErrors.INVALID_PASSWORD]: BusinessErrors.INVALID_CREDENTIALS,
    [DataErrors.INVALID_TOKEN]: BusinessErrors.INVALID_CREDENTIALS,
    [DataErrors.INVALID_TOKEN_FORMAT]: BusinessErrors.TOKEN_VALIDATION_ERROR,
    [DataErrors.INVALID_TOKEN_SIGNATURE]: BusinessErrors.TOKEN_VALIDATION_ERROR,
    [DataErrors.TOKEN_NOT_ACTIVE]: BusinessErrors.INVALID_CREDENTIALS,
    [DataErrors.TOKEN_EXPIRED]: BusinessErrors.INVALID_CREDENTIALS,
    [DataErrors.UNKNOWN_DATA_ERROR]: BusinessErrors.OTHER_DATA_ERROR,
};

export const HttpErrorMap: Record<BusinessErrors, HttpErrors> = {
    [BusinessErrors.VALIDATION_FAILURE]: HttpErrors.BAD_REQUEST,
    [BusinessErrors.TOKEN_VALIDATION_ERROR]: HttpErrors.BAD_REQUEST,
    [BusinessErrors.DATA_INTEGRITY_ERROR]: HttpErrors.BAD_REQUEST,
    [BusinessErrors.INVALID_CREDENTIALS]: HttpErrors.UNAUTHORIZED,
    [BusinessErrors.UNAUTHORIZED_ACCESS]: HttpErrors.UNAUTHORIZED,
    [BusinessErrors.UNAUTHENTICATED_ACCESS]: HttpErrors.FORBIDDEN,
    [BusinessErrors.USER_NOT_FOUND]: HttpErrors.NOT_FOUND,
    [BusinessErrors.ENTITY_NOT_FOUND]: HttpErrors.NOT_FOUND,
    [BusinessErrors.EMAIL_ALREADY_REGISTERED]: HttpErrors.CONFLICT,
    [BusinessErrors.USERNAME_ALREADY_TAKEN]: HttpErrors.CONFLICT,
    [BusinessErrors.LOGICAL_ERROR]: HttpErrors.CONFLICT,
    [BusinessErrors.TOKEN_ISSUE_ERROR]: HttpErrors.INTERNAL_SERVER_ERROR,
    [BusinessErrors.OTHER_DATA_ERROR]: HttpErrors.INTERNAL_SERVER_ERROR,
    [BusinessErrors.UNKNOWN_BUSINESS_ERROR]: HttpErrors.INTERNAL_SERVER_ERROR,
};

export class DataError extends Error {
    type: DataErrors;
    cause: Error | string;

    constructor(type: DataErrors, cause: Error | string) {
        super(type);
        this.name = this.constructor.name;
        this.type = type;
        this.cause = cause;
    }
}

export class BusinessError extends Error {
    type: BusinessErrors;
    cause: Error | string;

    constructor(type: BusinessErrors, cause: Error | string) {
        super(type);
        this.name = this.constructor.name;
        this.type = type;
        this.cause = cause;
    }
}

export class HttpError extends Error {
    status: number;
    type: HttpErrors;
    cause: Error | string;

    constructor(statusCode: number, type: HttpErrors, cause: Error | string) {
        super(type);
        this.name = this.constructor.name;
        this.status = statusCode;
        this.type = type;
        this.cause = cause;
    }
}

export function processMongoError(err: any): never {
    if (err.name === "MongoError") {
        switch (err.code) {
            case 11000: {
                if (Object.keys(err.keyValue).includes("email")) {
                    throw new DataError(DataErrors.DUPLICATE_EMAIL_NOT_ALLOWED, err);
                } else if (Object.keys(err.keyValue).includes("username")) {
                    throw new DataError(DataErrors.DUPLICATE_USERNAME_NOT_ALLOWED, err);
                } else {
                    throw new DataError(DataErrors.DUPLICATE_RECORDS_NOT_ALLOWED, err);
                }
            }
            case 11001:
                throw new DataError(DataErrors.DUPLICATE_RECORDS_NOT_ALLOWED, err);
            case 12000:
                throw new DataError(DataErrors.DB_WRITE_OPERATION_FAILED, err);
            case 12500:
                throw new DataError(DataErrors.DB_EXECUTION_INTERRUPTED, err);
            default:
                throw new DataError(DataErrors.DB_INTERNAL_ERROR, err);
        }
    } else if (err.name === "CastError") {
        throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, err);
    } else {
        throw new DataError(DataErrors.UNKNOWN_DATA_ERROR, err);
    }
}

export function processTokenError(err: any): never {
    switch (err.message) {
        case "jwt expired":
            throw new DataError(DataErrors.TOKEN_EXPIRED, err);
        case "jwt not active":
            throw new DataError(DataErrors.TOKEN_NOT_ACTIVE, err);
        case "jwt malformed":
            throw new DataError(DataErrors.INVALID_TOKEN_FORMAT, err);
        case "invalid signature":
            throw new DataError(DataErrors.INVALID_TOKEN_SIGNATURE, err);
        default:
            throw new DataError(DataErrors.INVALID_TOKEN, err);
    }
}

export function processValidationError(err: any): never {
    if (err.isJoi) {
        throw new BusinessError(BusinessErrors.VALIDATION_FAILURE, err);
    } else {
        throw new BusinessError(BusinessErrors.UNKNOWN_BUSINESS_ERROR, err);
    }
}

export function throwDataError(error: any): never {
    if (error instanceof DataError) {
        throw error;
    } else {
        throw new DataError(DataErrors.UNKNOWN_DATA_ERROR, error);
    }
}

export function throwBusinessError(error: any): never {
    if (error instanceof BusinessError) {
        throw error;
    } else if (error instanceof DataError) {
        throw new BusinessError(BusinessErrorMap[error.type] ?? BusinessErrors.OTHER_DATA_ERROR, error);
    } else {
        throw new BusinessError(BusinessErrors.UNKNOWN_BUSINESS_ERROR, error);
    }
}

export function throwHttpError(error: any): never {
    if (error instanceof HttpError) {
        throw error;
    } else if (error instanceof BusinessError) {
        throw new HttpError(HttpErrorCode[HttpErrorMap[error.type]], HttpErrorMap[error.type], error);
    } else if (error instanceof DataError) {
        throw new HttpError(
            HttpErrorCode[HttpErrorMap[BusinessErrorMap[error.type]]],
            HttpErrorMap[BusinessErrorMap[error.type]],
            error
        );
    } else {
        throw new HttpError(500, HttpErrors.INTERNAL_SERVER_ERROR, error);
    }
}

export const catchAsyncDataError = function <F extends (...args: any[]) => Promise<any>>(fn: F) {
    return async (...args: Parameters<F>): Promise<ReturnType<F>> => {
        try {
            return await fn(...args);
        } catch (error) {
            throwDataError(error);
        }
    };
};

export const catchAsyncBusinessError = function <F extends (...args: any[]) => Promise<any>>(fn: F) {
    return async (...args: Parameters<F>): Promise<ReturnType<F>> => {
        try {
            return await fn(...args);
        } catch (error) {
            throwBusinessError(error);
        }
    };
};

export const catchAsyncHttpError = function <F extends (...args: any[]) => Promise<any>>(fn: F) {
    return async (...args: Parameters<F>): Promise<ReturnType<F>> => {
        try {
            return await fn(...args);
        } catch (error) {
            throwHttpError(error);
        }
    };
};
