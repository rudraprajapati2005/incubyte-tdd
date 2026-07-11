import express from "express";
import errorHandler from "./errorHandler/errorHandler.js";
import * as authController from "./controller/auth.controller.js";
import authRoutes from "./routes/auth.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use("/api/auth/", authRoutes);
app.use("/api/vehicles" , vehicleRoutes);
app.use('/' , (req , res)=>{
    res.status(200).json({
        message: "Temorary Message : hello"
    });
});

app.use(errorHandler);
export default app;