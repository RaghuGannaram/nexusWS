const Joi = require("joi");

const registrationSchema = Joi.object({
    firstname: Joi.string().alphanum().min(3).max(20).required().messages({
        "string.base": "First name should be a string",
        "string.empty": "First name should not be empty",
        "string.alphanum": "First name should only contain alphanumeric characters",
        "string.min": "First name length must be at least {#limit} characters",
        "string.max": "First name length must be at most {#limit} characters",
        "any.required": "First name is required",
    }),

    lastname: Joi.string().alphanum().min(3).max(20).required().messages({
        "string.base": "Last name should be a string",
        "string.empty": "Last name should not be empty",
        "string.alphanum": "Last name should only contain alphanumeric characters",
        "string.min": "Last name length must be at least {#limit} characters",
        "string.max": "Last name length must be at most {#limit} characters",
        "any.required": "Last name is required",
    }),

    username: Joi.string().alphanum().min(3).max(20).required().messages({
        "string.base": "Username should be a string",
        "string.empty": "Username should not be empty",
        "string.alphanum": "Username should only contain alphanumeric characters",
        "string.min": "Username length must be at least {#limit} characters",
        "string.max": "Username length must be at most {#limit} characters",
        "any.required": "Username is required",
    }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.base": "Email should be a valid email address",
            "string.empty": "Email should not be empty",
            "string.email": "Email should be a valid email address",
            "string.min": "Email length must be at least {#limit} characters",
            "string.max": "Email length must be at most {#limit} characters",
            "any.required": "Email is required",
        }),

    password: Joi.string().min(4).max(20).required().messages({
        "string.base": "Password should be a string",
        "string.empty": "Password should not be empty",
        "string.min": "Password length must be at least {#limit} characters",
        "string.max": "Password length must be at most {#limit} characters",
        "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .lowercase()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.base": "Email should be a valid email address",
            "string.empty": "Email should not be empty",
            "string.email": "Email should be a valid email address",
            "string.min": "Email length must be at least {#limit} characters",
            "string.max": "Email length must be at most {#limit} characters",
            "any.required": "Email is required",
        }),

    password: Joi.string().min(4).max(20).required().messages({
        "string.base": "Password should be a string",
        "string.empty": "Password should not be empty",
        "string.min": "Password length must be at least {#limit} characters",
        "string.max": "Password length must be at most {#limit} characters",
        "any.required": "Password is required",
    }),
});

module.exports = { registrationSchema, loginSchema };
