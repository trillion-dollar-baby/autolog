/**
 * Error handler classes container ready to just be imported
 */

class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

class BadRequestError extends ExpressError { 
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

class UnauthorizedError extends ExpressError {
    constructor(message = 'Unauthorized Error') {
        super(message, 401);
    }
}

class ForbiddenError extends ExpressError {
    constructor(message = 'Forbidden Error') {
        super(message, 403);
    }
}

class NotFoundError extends ExpressError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError
}