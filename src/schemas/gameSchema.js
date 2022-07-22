import joi from 'joi';

const gameSchema=joi.object({
    name: joi.string().min(3).required(),
    image: joi.string().pattern(/^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi).required(),
    stockTotal: joi.number().positive().required(),
    categoryId: joi.number().positive().valid('COLOCAR QUERY QUE SELECIONA IDs DAS CATEGORIAS').required(),
    pricePerDay: joi.number().min(0).required(),
});

export {gameSchema};