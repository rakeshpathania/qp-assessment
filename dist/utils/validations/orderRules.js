import Joi from 'joi';
export const createOrderSchema = Joi.object({
    items: Joi.array()
        .items(Joi.object({
        groceryItemId: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
            'number.base': 'Grocery item ID must be a number',
            'number.integer': 'Grocery item ID must be an integer',
            'number.positive': 'Grocery item ID must be positive',
            'any.required': 'Grocery item ID is required'
        }),
        quantity: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.positive': 'Quantity must be positive',
            'any.required': 'Quantity is required'
        })
    }))
        .min(1)
        .required()
        .messages({
        'array.min': 'Order must contain at least one item',
        'array.base': 'Items must be an array',
        'any.required': 'Items are required'
    })
});
