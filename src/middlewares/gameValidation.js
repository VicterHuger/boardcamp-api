import { gameSchema } from "../schemas/gameSchema.js";
import connection from "../dbStrategy/postergres.js";
import { stripHtml } from "string-strip-html";

export async function gameBodyValidation(req,res,next){
    const {body}=req;

    for (const key of Object.keys(body)){
        body[key]=stripHtml(body[key]).result.trim();
    }
    const gameSchemaObject= await gameSchema();
    
    const {error}=gameSchemaObject.validate(body,{abortEarly:false});

    if(error){
        const errorMesssages=error.details.map(item=>item.message);
        let message='';
        errorMesssages.forEach(err=>{
            if((/\"name\" is required/).test(err)){
                return message+='Name field is required!\n';
            }
            if(err.includes('"name" is not allowed to be empty')){
                return message+='Name field is not allowed to be empty!\n';
            }
            if(err.includes('"name" length must be at least 3 characters long')){
                return message+='Game name length must be at least 3 characters long!\n';
            }
            if(err.includes('"image" with value')){
                return message+='Image must be a valid image URL! \n';
            }
            if(err.includes('"categoryId" must be [3]')){
                return message+=`Category id chosen doesn't exist!\n`;
            }else{
                return message+=err+'\n';
            }
        });
        return res.status(400).send(message);
    }
    const {rows:nameGame}= await connection.query('SELECT name FROM games WHERE name=$1',[body.name]);
    if(nameGame.length>0) return res.status(409).send('Game already registered!')

    res.locals.body=body;

    next();
}