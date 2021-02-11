import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const requeteSchema = new Schema({
    touristeId: {
        type: String,
        required: 'id touriste obligatoire'
    },
    guideId: String,
    annonceId: String,
    etatRequete: Boolean,
},
    {
        timestamps: true
    })