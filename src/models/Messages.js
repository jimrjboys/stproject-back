import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MessagesShema = new Schema({
    
    _id : {
        type  : String  
    },
    emetteurId: {
        type: String,
    },
    recepteurID: {
        type: String,
    },
    messages: {
        
        contenue : {
            type: String,
            required: 'Votre messages est vide ',
        },
        heure : {
            type : Date ,
            default:Date.now
        },
    },
   
},{ timestamps: true })
