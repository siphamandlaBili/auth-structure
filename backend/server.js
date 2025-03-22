import express from "express";
import { dbConnect } from "./db/databaseConnection.js";
import auth from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express(); 

app.use(express.json())
app.use(cookieParser());
app.use("/api/auth",auth)

const port = process.env.PORT || 3000;

const connect = async ()=>{
 try {
    await dbConnect();
    app.listen(port,()=>{  
        console.log(`listening on port ${port}....`)
     })
 } catch (error) {
    console.log(error.message)
 }
}

connect();