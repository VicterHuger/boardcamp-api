import joi from 'joi';

const categorySchema=joi.object({
    name:joi.string().min(4).required(),
})

export default categorySchema;