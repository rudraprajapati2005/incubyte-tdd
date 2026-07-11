import express from "express";
import userRoutes from "./Routes/user.routes.js";
import errorHandler from "./errorHandler/errorHandler.js";
import requestRoute from "./Routes/connect.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/' , (req , res)=>{
    res.status(200).json({
        message: "Temorary Message : hello"
    });
});

app.use(errorHandler);
export default app;