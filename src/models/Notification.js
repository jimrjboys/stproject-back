import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const NotificationSchema = new Schema({
    //ato ny  schema anle basentsika 
    title: {
        type: String,
        required: 'Veuillez entrer votre Titre',
    },
    description: {
        type: String,
        required: 'Veuillez entrer une description',
    },
    read: {
        type: Boolean,
    },
    type: {
        type: String,
    },


})