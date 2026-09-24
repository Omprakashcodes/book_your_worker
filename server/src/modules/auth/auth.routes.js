const express = require("express");

const {
    register,
    login,
    forgotPassword,
    resetPassword,
} = require("./auth.controller");

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} = require("./auth.validation");

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    register
);

router.post(
    "/login",
    loginValidation,
    login
);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);

module.exports = router;