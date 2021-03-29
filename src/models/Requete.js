import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const requeteSchema = new Schema({
    touristeId: {
        type: String,
        required: 'id touriste obligatoire'
    },
    guideId: {
        type: String,
        required: 'id du guide obligatoire'
    },
    annonceId: {
        type: String,
        required: 'id annonce obligatoire'
    },
    etatRequete: {
        type: Boolean,
        default: true
    },
    etatAnnulation: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })