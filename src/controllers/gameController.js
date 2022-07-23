import connection from "../dbStrategy/postergres.js";
import {stripHtml} from 'string-strip-html';

async function getGames(req,res){
    const nameGame=req.query.name || "";
    
    try{
        const name=stripHtml(nameGame).result.trim().toLowerCase();
        const {rows:games}= await connection.query(`
            SELECT games.*, categories.name as "categoryName"
            FROM games 
            JOIN categories
            ON games."categoryId"=categories.id 
            WHERE LOWER (games.name) LIKE $1`,[`${name}%`]
        );
        return res.status(200).send(games);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

async function createGame(req,res){
    const {body}=res.locals;
    try{
        const {rowCount}=await connection.query('INSERT INTO games (name,image,"stockTotal","categoryId",  "pricePerDay") VALUES ($1,$2,$3,$4,$5)',[body.name, body.image, body.stockTotal, body.categoryId,body.pricePerDay]);
        if(rowCount===0){
            return res.status(500).send('It was not possible to register a new game!')
        }
    return res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export {getGames,createGame};