import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const MessagesShema = new Schema({
    //ato ny  schema anle basentsika 
    emetteurId: {
        type: String,
    },
    recepteurID: {
        type: String,
    },
    messages: {
        type: String,
        required: 'Votre messages est vide ',
    },
    timestamps: true,
})