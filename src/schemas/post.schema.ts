import Joi, { type ObjectSchema } from "joi";
import type { IPostData, ICommentData } from "@src/types";

export const postSchema: ObjectSchema<IPostData> = Joi.object({
    description: Joi.string().required().max(500).messages({
        "string.base": "Description should be a string",
        "string.empty": "Description is required",
        "string.max": "Description length must be at most {#limit} characters",
    }),
});

export const commentSchema: ObjectSchema<ICommentData> = Joi.object({
    description: Joi.string().required().max(500).messages({
        "string.base": "Description should be a string",
        "string.empty": "Description is required",
        "string.max": "Description length must be at most {#limit} characters",
    }),
});
