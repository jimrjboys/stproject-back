import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const Facturation = new Schema ({
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