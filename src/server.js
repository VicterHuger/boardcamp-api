import  express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/router.js';

dotenv.config();

const app=express();

app.use([cors(), express.json(), router]);

const PORT = process.env.PORT || 4001;

app.listen(PORT, ()=>console.log(`Server listening on ${PORT} PORT`));

