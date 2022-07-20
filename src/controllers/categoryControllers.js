import connection from "../dbStrategy/postergres.js";

async function getCategories(_req,res){
    try{
        const {rows:categories} = await connection.query('SELECT * FROM categories');
        if(categories.length===0){
            return res.sendStatus(204);
        }
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