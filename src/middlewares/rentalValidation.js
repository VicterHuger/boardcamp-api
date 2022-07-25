import { stripHtml } from "string-strip-html";
import connection from "../dbStrategy/postergres.js";
import { rentalSchema } from "../schemas/rentalSchema.js";

async function rentalBodyValidation(req,res,next){
    const body=req.body;
    for(const key of Object.keys(body)){
        body[key]=sanitizateParam(body[key]);
    }
    const {customerId,gameId}=body;
    try{
        const {error}= rentalSchema.validate(body,{abortEarly:false})
        if(error){
            const errorMesssages=error.details.map(item=>item.message);
            let message='';
            errorMesssages.forEach(err=>{
                message+=`${err}\n`;
            })
            return res.status(400).send(message);
        }
        const {rows:customer} = await connection.query(`SELECT id FROM customers WHERE id=$1`,[customerId]);
        if(customer.length===0) return res.status(400).send("Customer doesn't exist! Please send a valid customerId!");
        const {rows:game}= await connection.query(`SELECT games."pricePerDay", games."stockTotal", games.id, games.name FROM games WHERE id=$1`,[gameId]);
        if(game.length===0) return res.status(400).send("Game doesn't exist! Please send a valid customerGame!");
        const {rows:rentals}= await connection.query(`
        SELECT r.* 
        FROM rentals r
        JOIN games g
        ON r."gameId"=g.id 
        WHERE g.id=$1 
        AND r."returnDate" IS NULL`,[game[0].id]);
        if(rentals.length>=game[0].stockTotal) return res.status(400).send(`All ${game[0].name} games are unavaiable to be rent!`);

        res.locals.pricePerDay=game[0].pricePerDay;
        res.locals.body=body;
        next();

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function rentalQueryStringValidation(req,res,next){
    const customerIdRaw=req.query.customerId || "";
    const gameIdRaw=req.query.gameId || "";

    const customerId=sanitizateParam(customerIdRaw);
    const gameId=sanitizateParam(gameIdRaw);

    
        if(customerId && (isNaN(Number(customerId))|| Number(customerId)<=0)){
            return res.status(400).send('Invalid customerId! An id must be an integer positive!');
        }
        if(gameId && (isNaN(Number(gameId))|| Number(gameId)<=0)){
            return res.status(400).send('Invalid gameId! An id must be an integer positive!');
        }
    res.locals.customerId=customerId;
    res.locals.gameId=gameId;

    next();
}

async function createQueryRentals(req,res,next){
    const offset=req.query.offset || 0;
    const limit=req.query.limit || 1e10;
    const column= req.query.order ? stripHtml(req.query.order).result.trim().split(' ')[0] : "id";
    const ordenation = req.query.desc==="true" ? "DESC" : "";
    try{
        const {customerId}=res.locals || "";
        const {gameId}=res.locals || "";
        let sqlQuery;
        let sqlParams;

        if(!gameId && !customerId){
            sqlQuery=`
            SELECT r.*, c.id as "cId", c.name as "cName", g.id as "gId", g.name as "gName", g."categoryId", ca.name as "categoryName"  
            FROM rentals r
            JOIN customers c
            ON r."customerId"=c.id
            JOIN games g
            ON r."gameId"=g.id
            JOIN categories ca
            ON g."categoryId"=ca.id
            ORDER BY ${column} ${ordenation}
            LIMIT $1 OFFSET $2
            `;
            sqlParams=[limit, offset]
        }else if(!gameId && customerId){
            sqlQuery=`
            SELECT r.*, c.id as "cId", c.name as "cName", g.id as "gId", g.name as "gName", g."categoryId", ca.name as "categoryName"  
            FROM rentals r
            JOIN customers c
            ON r."customerId"=c.id
            JOIN games g
            ON r."gameId"=g.id
            JOIN categories ca
            ON g."categoryId"=ca.id
            WHERE c.id=$1
            ORDER BY ${column} ${ordenation}
            LIMIT $2 OFFSET $3
            `;
            sqlParams=[customerId, limit,offset];
        }else if(gameId && !customerId){
            sqlQuery=`
            SELECT r.*, c.id as "cId", c.name as "cName", g.id as "gId", g.name as "gName", g."categoryId", ca.name as "categoryName"  
            FROM rentals r
            JOIN customers c
            ON r."customerId"=c.id
            JOIN games g
            ON r."gameId"=g.id
            JOIN categories ca
            ON g."categoryId"=ca.id
            WHERE g.id=$1
            ORDER BY ${column} ${ordenation}
            LIMIT $2 OFFSET $3
            `;
            sqlParams=[gameId,limit,offset];
        }else if(gameId && customerId){
            sqlQuery=`
            SELECT r.*, c.id as "cId", c.name as "cName", g.id as "gId", g.name as "gName", g."categoryId", ca.name as "categoryName"  
            FROM rentals r
            JOIN customers c
            ON r."customerId"=c.id
            JOIN games g
            ON r."gameId"=g.id
            JOIN categories ca
            ON g."categoryId"=ca.id
            WHERE g.id=$1 
            AND c.id=$2
            ORDER BY ${column} ${ordenation}
            LIMIT $3 OFFSET $4
            `;
            sqlParams=[gameId, customerId, limit, offset];
        }
        res.locals.sqlQuery=sqlQuery || "";
        res.locals.sqlParams=sqlParams || null;
        next();

    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }   
}

async function validateRentalReturn(req,res,next){
    const {id}=req.params;
    if(isNaN(Number(id)) || Number(id)<=0) return res.status(400).send('Id must be a positive integer');
    try{
        const {rows:rental}= await connection.query(`
        SELECT * FROM rentals r
        WHERE r.id=$1
        `,[id]);
        if(rental.length===0) return res.status(404).send("There isn't a rental with this id!");
        if(rental[0].returnDate) return res.status(400).send("This rental has already been returned!");
        res.locals.rental=rental[0];
        next();       
    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }
}

async function validateDeleteRental(req,res,next){
    const {id}=req.params;
    if(isNaN(Number(id)) || Number(id)<=0) return res.status(400).send('Id must be a positive integer');
    try{
        const {rows:rental}= await connection.query(`
        SELECT * FROM rentals r
        WHERE r.id=$1
        `,[id]);
        if(rental.length===0) return res.status(404).send("There isn't a rental with this id!");
        if(!rental[0].returnDate) return res.status(400).send("This rental hasn't returned!");
        next();       
    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }
}



function sanitizateParam(param){
    const newParam = param?.toString() || '';
    return stripHtml(newParam).result.trim();
}

export {rentalBodyValidation,rentalQueryStringValidation,createQueryRentals,validateRentalReturn, validateDeleteRental};