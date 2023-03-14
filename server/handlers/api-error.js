class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }

    static badReq(message) {
        return new ApiError(404, message);
    }

    static internalReq(message) {
        return new ApiError(500, message);
    }

    static forbiddenReq(message) {
        return new ApiError(403, message);
    }
}

module.exports = ApiError