import express from "express";
import { dbConnect } from "./db/databaseConnection.js";
import auth from "./routes/authRoutes.js"
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use("/api/auth",auth)

const connect = async ()=>{
 try {
    await dbConnect();
    app.listen(process.env.PORT,()=>{  
        console.log(`listening on port ${process.env.PORT}....`)
     })
 } catch (error) {
    console.log(error.message)
 }
}

connect();