const { body } = require("express-validator");

const workerProfileValidation = [
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isMobilePhone("any")
        .withMessage("Please enter a valid phone number"),

    body("skills")
        .isArray({ min: 1 })
        .withMessage("At least one skill is required"),

    body("experience")
        .isNumeric()
        .withMessage("Experience must be a number")
        .isFloat({ min: 0 })
        .withMessage("Experience cannot be negative"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),

    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),

    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),

    body("serviceLocation.latitude")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Use your current location to set a valid service latitude"),

    body("serviceLocation.longitude")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Use your current location to set a valid service longitude"),

    body("dailyWage")
        .isNumeric()
        .withMessage("Daily wage must be a number")
        .isFloat({ min: 0 })
        .withMessage("Daily wage cannot be negative"),
];

module.exports = {
    workerProfileValidation,
};