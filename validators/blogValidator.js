import joi from 'joi';
export const createBlogSchema=joi.object({
    title:joi.string()
            .required()
            .trim()
            .min(3)
            .max(120),
    body:joi.string()
            .trim()
            .required()
            .min(10),
    description:joi.string()
                   .trim()
                   .min(3)
                   .max(120)
});

export const updateBlogchema=joi.object({
    title:joi.string()
            .trim()
            .min(3)
            .max(120),
    body:joi.string()
            .trim()
            .min(10),
    description:joi.string()
                   .trim()
                   .min(3)
                   .max(120)
});

export const searchValidator=joi.object({
    search:joi.string()
              .trim()
              .min(3)
              .max(20)
              .allow("")
              .optional()
});

export const idSchema = joi.object({
    id: joi.string()
        .hex()
        .trim()
        .length(24)
        .required()
        .messages({
            'string.length': 'The ID must be exactly 24 characters long',
            'string.hex': 'The ID must be a valid hexadecimal string'
        })
});