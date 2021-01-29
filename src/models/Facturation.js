import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const FacturationSchema = new Schema ({
 //ato ny  schema anle basentsika 

    prix : {
        type : Number , 
    },
    itineraireToursime : {
        type : String , 
    },
    duree : {
        type : Number,
    },
    heureRDV : {
        type : String , 
    },
    timestamps: true , 

})