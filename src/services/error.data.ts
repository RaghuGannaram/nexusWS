function handleDataError(err: any) {
    if (err.name === "MongoError") {
        if (err.code === 11000) {
            err.status = 409;
            if (Object.keys(err.keyValue).includes("email")) {
                err.message = "Conflict";
                err.type = "EMAIL_ALREADY_REGISTERED";
                err.description = "Email already registered. Please log in.";
            } else if (Object.keys(err.keyValue).includes("username")) {
                err.message = "Conflict";
                err.type = "USERNAME_ALREADY_TAKEN";
                err.description = "Username already taken. Please try another one.";
            } else {
                err.message = "Conflict";
                err.type = "DUPLICATE_KEY_ERROR";
                err.description = "Duplicate key error in the database.";
            }
        } else if (err.type === 11001) {
            err.status = 409;
            err.message = "Conflict";
            err.type = "DUPLICATE_KEY_UNIQUE";
            err.description = "Duplicate key error: unique constraint violated.";
        } else if (err.type === 12500) {
            err.status = 500;
            err.message = "Internal Server Error";
            err.type = "DB_EXECUTION_INTERRUPTED";
            err.description = "Database execution interrupted.";
        } else if (err.type === 12000) {
            err.status = 500;
            err.message = "Internal database error";
            err.type = "DB_WRITE_OPERATION_FAILED";
            err.description = "MongoDB write operation failed.";
        } else {
            err.status = 500;
            err.message = "Internal Server Error";
            err.type = "INTERNAL_DATABASE_ERROR";
            err.description = "Internal database error.";
        }
    }


    return err;
}

export default handleDataError;
