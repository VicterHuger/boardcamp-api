import dayjs from "dayjs";
import connection from "../dbStrategy/postergres.js";

async function creteRental(_req,res){
    const {body}=res.locals;
    const {pricePerDay}=res.locals;
    const {customerId, gameId, daysRented}=body;
    try{
        const rentDate = dayjs('2022-07-15').format('YYYY-MM-DD');
        const originalPrice=Number(daysRented)*Number(pricePerDay);
        const returnDate=null;
        const delayFee=null;
        const {rowCount}= await connection.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1,$2,$3,$4,$5,$6,$7)`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
        );
        if(rowCount===0) return res.status(500).send("It wasn't possible to create a new rent!");   
        return res.sendStatus(201);

    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

async function getRentals(_req,res){
    const {sqlQuery}=res.locals;
    const {sqlParams}=res.locals;
    try{
        const {rows:rentalsRaw} = await connection.query(sqlQuery,sqlParams);
        if(rentalsRaw.length===0){
            return res.sendStatus(204);
        }
        const rentals = prettyRentalsFormat(rentalsRaw);
        return res.status(200).send(rentals);
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

function prettyRentalsFormat(array){
    const newArray = array.map(item=>({
        ...item,
        customer:{
            id:item.cId,
            name:item.cName
        },
        game:{
            id: item.gId,
            name: item.gName,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
        }
    }
    ));
    newArray.forEach(item=>{
        delete item.cId;
        delete item.cName;
        delete item.gId;
        delete item.gName;
        delete item.categoryId
        delete item.categoryName
    });

    return newArray;
    
}

async function returnRental(req,res){
    const {rental}=res.locals;
    const {id}=req.params;
    try{
       rental.returnDate=dayjs().format('YYYY-MM-DD');
       rental.delayFee= await calculateDelayFee(rental); 
       const {rowCount}= await connection.query(`
       UPDATE rentals 
       SET "returnDate"=$1, "delayFee"=$2
       WHERE  rentals.id=$3`,[rental.returnDate, rental.delayFee, id]);
       if(rowCount===0) return res.status(500).send('Something went wrong when updating rentals!');
       return res.sendStatus(200);
        
    }catch(err){
        console.error(err);
        return res.send
    }
}

async function calculateDelayFee(object){
    try{
        const daysRented=Math.floor((Date.now() - Date.parse(object.rentDate))/86400000);
        
        const daysInitialRented=Number(object.daysRented);
        
        if(daysInitialRented>=daysRented) return null;
        const {rows: game} = await connection.query(`
        SELECT g."pricePerDay" 
        FROM games g 
        WHERE g.id=$1`
        ,[object.gameId]);
        if(game.length===0){
            console.log( new Error('Something went wrong on searching for the game rented!'))
        }
        return Number(game[0].pricePerDay)*(daysRented-daysInitialRented);

    }catch(err){
        console.error(err);
    }
}

async function deleteRental(req,res){
    const {id}=req.params;
    try{
        const {rowCount}= await connection.query(`
        DELETE FROM rentals WHERE id=$1`,[id]);
        if(rowCount===0) return res.status(500).send('Something went wrong on deleting rental');
        return res.sendStatus(200);
    }catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
}

export {creteRental,getRentals, returnRental, deleteRental}