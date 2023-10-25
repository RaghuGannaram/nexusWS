const Joi = require('joi');

const postSchema = Joi.object({
    author: Joi.object({
        id: Joi.string().required().label('author_id'),
        name: Joi.string()
            .required()
            .min(3)
            .max(20)
            .messages({
                'string.base': 'name should be a string',
                'string.empty': 'name is required',
                'string.min': 'name length must be at least {#limit} characters',
                'string.max': 'name length must be at most {#limit} characters',
            })
            .label('author_name'),
        handle: Joi.string()
            .required()
            .min(3)
            .max(20)
            .messages({
                'string.base': 'handle should be a string',
                'string.empty': 'handle is required',
                'string.min': 'handle length must be at least {#limit} characters',
                'string.max': 'handle length must be at most {#limit} characters',
            })
            .label('author_handle'),
    }),
    description: Joi.string()
        .required()
        .max(500)
        .messages({
            'string.base': 'description should be a string',
            'string.empty': 'description is required',
            'string.max': 'description length must be at most {#limit} characters',
        }),
    date: Joi.date().default(() => new Date(), 'current date'),
    likes: Joi.array().default([]),
    img: Joi.string().default(''),
    comments: Joi.array().items(Joi.object()).default([]),
});

const optionalPostSchema = postSchema;

for (const key of Object.keys(optionalPostSchema.describe().keys)) {
    optionalPostSchema = optionalPostSchema.keys({
        [key]: optionalPostSchema._ids._byKey[key].optional(),
    });
}

const commentSchema = Joi.object({
    author: Joi.object({
        id: Joi.string()
            .required()
            .label('author_id')
            .messages({
                'string.base': 'author_id should be a string',
                'string.empty': 'author_id is required',
            }),
        name: Joi.string()
            .required()
            .min(3)
            .max(20)
            .messages({
                'string.base': 'author_name should be a string',
                'string.empty': 'author_name is required',
                'string.min': 'author_name length must be at least {#limit} characters',
                'string.max': 'author_name length must be at most {#limit} characters',
            })
            .label('author_name'),
        handle: Joi.string()
            .required()
            .min(3)
            .max(20)
            .messages({
                'string.base': 'author_handle should be a string',
                'string.empty': 'author_handle is required',
                'string.min': 'author_handle length must be at least {#limit} characters',
                'string.max': 'author_handle length must be at most {#limit} characters',
            })
            .label('author_handle'),
    }),
    description: Joi.string()
        .required()
        .max(500)
        .messages({
            'string.base': 'description should be a string',
            'string.empty': 'description is required',
            'string.max': 'description length must be at most {#limit} characters',
        }),
    date: Joi.date().default(() => new Date(), 'current date'),
    likes: Joi.array().default([]),
    hidden: Joi.boolean().default(false),
});

const optionalCommentSchema = commentSchema;

for (const key of Object.keys(optionalCommentSchema.describe().keys)) {
    optionalCommentSchema = optionalCommentSchema.keys({
        [key]: optionalCommentSchema._ids._byKey[key].optional(),
    });
}

module.exports = { postSchema, optionalPostSchema, commentSchema, optionalCommentSchema };