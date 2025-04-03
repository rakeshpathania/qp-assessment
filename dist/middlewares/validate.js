import { ValidationError } from "../utils/errorHandlers.js";
export const validateRequest = (schema, sources = ['body']) => {
    return (req, res, next) => {
        try {
            let data = {};
            if (sources.includes('body')) {
                data = { ...data, ...req.body };
            }
            if (sources.includes('query')) {
                data = { ...data, ...req.query };
            }
            const { error } = schema.validate(data, {
                abortEarly: false,
                stripUnknown: true,
            });
            if (error) {
                const errorMessages = error.details.map((detail) => detail.message);
                return next(new ValidationError("Validation failed", errorMessages.join(", ")));
            }
            next();
        }
        catch (err) {
            return next(new ValidationError("Validation error", err instanceof Error ? err.message : 'Unknown error'));
        }
    };
};
