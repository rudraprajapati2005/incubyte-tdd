import express from "express";
import errorHandler from "./errorHandler/errorHandler.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/api/auth/register' , (req,res)=>{
    res.status(201).json({token : "dummy-token"});
});
app.use('/' , (req , res)=>{
    res.status(200).json({
        message: "Temorary Message : hello"
    });
});

app.use(errorHandler);
export default app;