import User from "../models/User.js";

export const  findByEmail = async(email)=>
{
    return User.findOne({email});
}

export const create= async(userData)=>{
    return User.create(userData);
}