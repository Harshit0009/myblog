const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// here we have to write the logic that wether the user is authenticated or not
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if(!token) {
        return next(new ErrorResponse("You must log in...", 401)); // unauthorized
    }

    // now we need to verify the token that if token is valid or not
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (error) {
        return next(new ErrorResponse('you must log in...', 401));
    }
}

// for admin
exports.isAdmin = (req, res, next) => {
    if(req.user.role === "user") {
        return next(new ErrorResponse("Access denied, you must be an admin", 401));
    }
    next();
}