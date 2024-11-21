import ApiError from "./error";

class BadRequestError extends ApiError {
    constructor(message: string = "Bad Request"){
        super(message, 400, "BAD_REQUEST")
    }
}

class NotFoundError extends ApiError{
    constructor(message: string = "Resources Not Found"){
        super(message, 404, "NOT_FOUND")
    }
}

class UnauthorizedError extends ApiError{
    constructor(message: string = "Unauthorized"){
        super(message, 401, "UNAUTHORIZED")
    }
}

export { BadRequestError, NotFoundError, UnauthorizedError}
