import connection from "../dbStrategy/postergres.js";
import { customerSchema } from "../schemas/customerSchema.js";
import { stripHtml } from "string-strip-html";

async function customerBodyValidation(req,res,next){
    const {body}=req;

    for (const key of Object.keys(body)){
        body[key]=stripHtml(body[key]).result.trim();
    }

    const {error}=customerSchema.validate(body,{abortEarly:false});

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
            }
            if(err.includes('"phone" is required')){
                return message+='Phone field is required!!\n';
            }
            if(err.includes('"phone" is not allowed to be empty')){
                return message+='Phone field is not allowed to be empty!\n';
            }
            if(err.includes('"phone" with value')){
                return message+='Phone must contains only numbers!\n';
            }
            if(err.includes('"cpf" is required')){
                return message+='CPF field is required!\n';
            }
            if(err.includes('"cpf" is not allowed to be empty')){
                return message+='CPF field is not allowed to be empty!\n';
            }
            if(err.includes('"cpf" with value')){
                return message+='CPF must contains only numbers!\n';
            }
            if(err.includes('"birthday" is required')){
                return message+='Birthday field is required!\n';
            }else{
                return message+=err+'\n';
            }
        });
        return res.status(400).send(message);
    }
   
    const {rows:costumer}=await connection.query('SELECT * FROM customers WHERE cpf=$1',[body.cpf]);
    if(costumer.length>0) return res.status(409).send('CPF already registred!');

    res.locals.body=body;

    next();
}

async function validateCpfQueryString(req,res,next){
    try{
        const {cpf}=req.query;
        if(cpf && (isNaN(Number(cpf))||cpf.length>11)){
            return res.status(422).send('CPF query string invalid! Only allowed maximum of 11 numbers digts!')
        };
        next();
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

async function validateIdParams(req,res,next){
    try{
        const {id}=req.params;
        const {rows:customer}= await connection.query('SELECT * FROM customers WHERE id=$1',[id]);
        if(customer.length===0) return res.status(404).send("There is no customer with this id, try another one!");
        res.locals.customer=customer;
        next();
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export {customerBodyValidation,validateCpfQueryString,validateIdParams}