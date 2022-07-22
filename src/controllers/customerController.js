import connection from "../dbStrategy/postergres.js";

async function createCustomer(_req,res){
    try{
        const body=res.locals.body;
        const costumer=await connection.query('INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)',[body.name,body.phone,body.cpf,body.birthday]);
        if(costumer.rowCount===0){
            return res.status(500).send('Fail to register customer!');
        }
        return res.sendStatus(201);

    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}

async function getCustomers(req,res){
    const cpf=req.query.cpf;
    
    try{
        if(!cpf){
            const {rows:customers}=await connection.query('SELECT * FROM customers');
            if(customers.length===0){
            return res.sendStatus(204);
            }
            return res.status(200).send(customers);
        }
        const {rows:customers}= await connection.query('SELECT * FROM customers WHERE cpf LIKE $1',[`${cpf}%`]);
        if(customers.length===0) return res.sendStatus(204);
        return res.status(200).send(customers);
        
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }
}

async function getCustomerById(_req,res){
    const {customer}=res.locals;
    return res.status(200).send(customer);
}

async function updateCustomerById(req,res){
    const {id}=req.params;
    const {body}=res.locals;
    try{
        const {rowCount}= await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5',[body.name,body.phone,body.cpf,body.birthday,id]);
        if(rowCount===0){
            return res.status(500).send('Fail to update customer!');
        }
        return res.sendStatus(200);
        
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export {createCustomer,getCustomers,getCustomerById,updateCustomerById};