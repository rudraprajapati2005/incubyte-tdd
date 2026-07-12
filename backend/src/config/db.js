import mongoose from "mongoose";

 const connectDb = async()=>{
    try{
        const conStr = process.env.DATABASE_URL;
        console.log("Connecting to:", process.env.DATABASE_URL);

        if(!conStr)
        {
            throw new Error("Database URL not found");
        }
        const conn = mongoose.connect(conStr);
        console.log("Connected Successfully");
    }
    catch(err)
    {
        console.log("Error while connecting to the Database : "  + err);
    }
}
export default connectDb;