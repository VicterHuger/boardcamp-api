import { stripHtml } from "string-strip-html";
import connection from "../dbStrategy/postergres.js";

async function getCategories(req,res){
    const offset=req.query.offset || 0;
    const limit=req.query.limit || 1e10;
    const column= req.query.order ? stripHtml(req.query.order).result.trim().split(' ')[0] : "id";
    const ordenation = req.query.desc==="true" ? "DESC" : "";
    try{
        const {rows:categories} = await connection.query(
            `SELECT * 
            FROM categories
            ORDER BY ${column} ${ordenation}
            LIMIT $1 OFFSET $2`,
            [limit,offset]);
        return res.status(200).send(categories);

    }catch(error){
        console.error(error);
        return res.status(500).send(error);
    }
}

async function signupNewCategory(_req,res){
    const category=res.locals.category;

    try{
        await connection.query('INSERT INTO categories (name) VALUES ($1)',[category]);
        res.sendStatus(201);
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

export {getCategories,signupNewCategory}; 