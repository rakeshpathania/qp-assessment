import Joi from "joi";
// Admin Registration Rules
export const adminRegistrationRules = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name cannot exceed 50 characters"
    }),
    email: Joi.string()
        .email()
        .required()
        .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address"
    }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    })
}).strict();
// Admin Login Rules
export const adminLoginRules = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email address"
    }),
    password: Joi.string()
        .required()
        .messages({
        "string.empty": "Password is required"
    })
}).strict();
