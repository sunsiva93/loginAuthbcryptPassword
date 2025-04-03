import express from "express"
import dotenv from "dotenv"
import dbConn from "./model/db/conn.js";

const env = dotenv.config({path: '.env', encoding:"UTF-8" , debug: true, override: false})
console.log(env);

const app = express()
const PORT = process.env.PORT

app.listen(PORT , async ()=>{
    await dbConn()
    console.log(`server is running on port: http://127.0.0.1:${PORT}`);
})