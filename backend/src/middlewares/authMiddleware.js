import jwt from "jsonwebtoken";

export const authMiddleware = (req ,res , next)=>{

    const header = req.headers.authorization;
    console.log("Authorization header in test:", header);
    if(!header)
    {
        return res.status(401).json({
            error : "No token"
        });
    }

    const token = header.split(" ")[1];

    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET || "secret");
        req.user = decode;
        next();
    }
    catch{
        res.status(401).json({
            error : "Invalid token"
        });
    }

};

export const adminOnly = async(req , res , next)=>{

    if(req.user.role !== "admin")
    {
        return res.status(403).json({
            error : "Forbidden"
        });
    }
    next();
}