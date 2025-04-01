import Joi from "joi";

export const userRegistrationRules = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 2 characters long",
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
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
            "string.pattern.base": "Phone number must be 10 digits"
        })
}).strict();

export const userLoginRules = Joi.object({
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

