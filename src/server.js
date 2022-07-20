import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app=express();

app.use(cors());

const PORT = process.env.PORT || 4001;

app.listen(PORT, ()=>console.log(`Server listening on ${PORT} PORT`));

