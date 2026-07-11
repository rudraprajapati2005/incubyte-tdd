import express from "express";
import errorHandler from "./errorHandler/errorHandler.js";
import * as authController from "./controller/auth.controller.js";
import authRoutes from "./routes/auth.route.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.post("/api/auth/", authRoutes);
app.use('/' , (req , res)=>{
    res.status(200).json({
        message: "Temorary Message : hello"
    });
});

app.use(errorHandler);
export default app;