import Joi from "joi";
export const addGroceryItemRules = Joi.object({
    name: Joi.string()
        .min(2)
        .required()
        .messages({
        "string.empty": "Item name is required",
        "string.min": "Item name must be at least 2 characters long"
    }),
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be greater than 0",
        "number.precision": "Price cannot have more than 2 decimal places"
    }),
    quantityInStock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be a whole number",
        "number.min": "Quantity cannot be negative"
    }),
}).strict();
export const updateGroceryItemRules = Joi.object({
    name: Joi.string()
        .min(2)
        .optional()
        .messages({
        "string.empty": "Item name is required",
        "string.min": "Item name must be at least 2 characters long"
    }),
    price: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
        "number.base": "Price must be a number",
        "number.positive": "Price must be greater than 0",
        "number.precision": "Price cannot have more than 2 decimal places"
    }),
}).strict()
    .or('name', 'price')
    .messages({
    'object.missing': 'At least one field must be provided for update'
});
export const updateInventoryLevelRules = Joi.object({
    quantityInStock: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be a whole number",
        "number.min": "Quantity cannot be negative"
    }),
}).strict();
