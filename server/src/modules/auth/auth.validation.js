const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("phone")
        .trim()
        .matches(/^(?:\+?[1-9][\d\s()-]{7,17}|\d{10})$/)
        .withMessage("Enter a valid mobile number, for example 9876543210 or +919876543210"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .optional()
        .isIn(["customer", "worker"])
        .withMessage("Invalid role"),
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

const forgotPasswordValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),
];

const resetPasswordValidation = [
    body("token")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
};