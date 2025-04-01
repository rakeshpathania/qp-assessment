import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationError } from "../utils/errorHandlers.js";

type ValidationSource = 'body' | 'query';

export const validateRequest = (
    schema: Schema,
    sources: ValidationSource[] = ['body']
) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            let data: Record<string, any> = {};
            
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
                return next(
                    new ValidationError("Validation failed", errorMessages.join(", "))
                );
            }

            next();
        } catch (err) {
            return next(
                new ValidationError("Validation error", err instanceof Error ? err.message : 'Unknown error')
            );
        }
    };
};
