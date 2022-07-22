import joi from 'joi';

const customerSchema=joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
    cpf: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    birthday: joi.date().raw().required(),
}); 

export {customerSchema};