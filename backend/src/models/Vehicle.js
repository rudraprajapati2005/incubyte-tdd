import {Schema , model}  from "mongoose";

const VehicleSchema = new Schema(
    {
        make :{
            type : String ,
            required  : true,
            trim : true

        } ,

        model : {
            type : String ,
            required : true , 
            trim : true
        } , 

        category : {
            type : String ,
             enum: [
        "SEDAN",
        "HATCHBACK",
        "SUV",
        "COMPACT_SUV",
        "COUPE",
        "CONVERTIBLE",
        "PICKUP",
        "MPV",
        "WAGON",
        "CROSSOVER",
        "SPORTS",
        "LUXURY",
        "ELECTRIC",
        "HYBRID",
        "OFF_ROAD",
      ],
        },

        price :{
            type : Number,
            required : true,
            min : 0,
        },

        quantity : {

            type : Number ,
            required : true,
            min : 0 ,
            default : 0
        } ,

    },{
        timestamps : true,
    }
);

export default model('Vehicle' , VehicleSchema);