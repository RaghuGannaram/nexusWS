class CustomError extends Error {
    constructor(message, status, type, description) {
        super(message);
        this.status = status;
        this.type = type;
        this.description = description;
    }
}
module.exports = CustomError;
