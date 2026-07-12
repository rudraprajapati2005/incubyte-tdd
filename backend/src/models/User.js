import {Schema , model} from "mongoose";

const UserSchema = new Schema(
  {
    name : {
      type : String, 
      required : [true , "Name is Required"],
      trim : true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (value) =>
          /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(value),
        message:
          "Password must be at least 8 characters, contain one uppercase letter, and one special character",
      },
      
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default model("User" , UserSchema);