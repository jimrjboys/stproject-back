import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OpionionUsersSchema = new Schema({
    //ato ny  schema anle basentsika 
    note: {
        type: Number,
    },
    avis: {
        type: String,
    },
    etatSuppr: {
        type: Boolean,
    },


}, { timestamps: true })