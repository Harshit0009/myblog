const express = require("express");
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");

async function handleSignup(req, res, next) {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse("E-mail already registered", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            id: user._id,
        })
    } catch (error) {
        next(error);
    }
}

async function handleLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        // doing some validation checks on email and password
        if (!email) {
            return next(new ErrorResponse("please add an email", 403))
        }
        if (!password) {
            return next(new ErrorResponse("Please add a password", 403));
        }

        const user = await User.findOne({email});
        if (!user) {
            return next(new ErrorResponse("User not found", 400));
        }

        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("Invalid Password", 400));
        }

        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        next(error);
    }
}

// function to generate jwt token and store it in as form of the cookie
const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    const options = { maxAge: 60 * 60 * 1000, httpOnly: true };
    if (process.env.NODE_ENV === "production") {
        options.secure = true
    }
    res.status(codeStatus).cookie('token', token, options).json({
        success: true,
        id: user._id,
        role: user.role,
    });
}

// log out
async function handleLogOut(req, res, next) {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out",
    })
}

async function handleGetUserProfile(req, res, next) {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        success: true,
        user
    })
}
module.exports = {
    handleSignup,
    handleLogin,
    handleGetUserProfile,
    handleLogOut
}
