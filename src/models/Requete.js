import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const requeteSchema = new Schema({
    touristeId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: 'id touriste obligatoire'
    },
    guideId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: 'id du guide obligatoire'
    },
    annonceId: {
        type: Schema.ObjectId,
        ref: 'annonces',
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