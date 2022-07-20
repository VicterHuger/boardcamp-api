import pkg from 'pg';

const {Pool} =pkg;

// const user=process.env.PGUSER;
// const password=process.env.PGPASSWORD;
// const host=process.env.PGHOST;
// const port=process.env.PGPORT;
// const database=process.env.PGDATABASE;

// const connection = new Pool({
//     user,
//     password,
//     host,
//     port,
//     database,
// });


const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
})
  
export default connection;