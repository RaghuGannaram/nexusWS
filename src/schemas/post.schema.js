const Joi = require('joi');

const postSchema = Joi.object({
    description: Joi.string()
        .required()
        .max(500)
        .messages({
            'string.base': 'description should be a string',
            'string.empty': 'description is required',
            'string.max': 'description length must be at most {#limit} characters',
        }),
});

const commentSchema = Joi.object({
    description: Joi.string()
        .required()
        .max(500)
        .messages({
            'string.base': 'description should be a string',
            'string.empty': 'description is required',
            'string.max': 'description length must be at most {#limit} characters',
        }),
});

module.exports = { postSchema, commentSchema };