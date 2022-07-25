import connection from "../dbStrategy/postergres.js";

async function getCategories(req,res){
    const offset=req.query.offset || 0;
    const limit=req.query.limit || 1e10;
    try{
        const {rows:categories} = await connection.query(
            `SELECT * 
            FROM categories
            LIMIT $1 OFFSET $2`,
            [limit,offset]);
        return res.status(200).send(categories);

    }catch(error){
        console.error(error);
        return res.sendStatus(500);
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