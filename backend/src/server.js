import express from "express";
import dotenv from "dotenv";
import app from  "./app.js";
import connectDb from "./config/db.js"
dotenv.config();
const PORT = process.env.PORT || 5000;

async function startServer()
{
    try{
        await connectDb();
        app.listen(PORT , ()=>{
            console.log(`Server started at the ${PORT}`);
        })
    }
    catch(err){
        console.log("Error Message  : " + err);
        process.exit(1);
    }
}

startServer();