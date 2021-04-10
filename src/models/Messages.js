import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MessagesShema = new Schema({
    
    _id : {
        type  : String  
    },
    emetteurId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: true
    },
    recepteurID: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: true
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
