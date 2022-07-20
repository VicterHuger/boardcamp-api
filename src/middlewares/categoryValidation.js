import connection from "../dbStrategy/postergres.js";
import categorySchema from "../schemas/categorySchema.js";
import {stripHtml} from 'string-strip-html';


async function categoryBodyValidation(req,res,next){
    const body=req.body;

    for(const key of Object.keys(body) ){
        body[key]=stripHtml(body[key]).result.trim();
    };
    
    const {error} =categorySchema.validate(body,{abortEarly:false});

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
            if(err.includes('"name" length must be at least 4 characters long')){
                return message+='Name length must be at least 4 characters long!\n';
            }else{
                return message+=err+'\n';
            }
        });
        return res.status(400).send(message);
    }

    try{
        const {rows:category} = await connection.query('SELECT * FROM categories WHERE name=$1', [req.body.name]);
        if(category.length>0){
            return res.status(409).send('Category already registered!');
        }
        res.locals.category=req.body.name;
        next();
    }catch(err){
        console.error(err);
        return res.sendStatus;
    }


}


export {categoryBodyValidation};