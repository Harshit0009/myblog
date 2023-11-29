const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = {...err };
    error.message = err.message;

    if (err.name === "CastError") {
        const message  = `Resource not found ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate value in database error
    if(err.code === 11000) {
        const message = "Duplicate field value entered";
        errror = new ErrorResponse(message, 400);
    }

    // validation error in mongoose
    if(err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => " " + val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.codeStatus || 500).json({
        success: false,
        error: error.message || "server error"
    })
}

module.exports = errorHandler;