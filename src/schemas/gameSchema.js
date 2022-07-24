import joi from 'joi';
import connection from '../dbStrategy/postergres.js';

async function gameSchema(){
    try{
        const {rows:ids}= await connection.query('SELECT id FROM categories');
        const idsArray= ids.map(id=>id.id);
        const gameSchemaObject=joi.object({
                name: joi.string().min(3).required(),
                image: joi.string().pattern(/^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/i).uri().required(),
                stockTotal: joi.number().positive().required(),
                categoryId: joi.number().valid(...idsArray).required(),
                pricePerDay: joi.number().positive().required(),
            });
        return gameSchemaObject;
    }catch(err){
        console.log(err);
    }
}

export {gameSchema};



