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
        type: Number, //0: en attente, 1: ok, 2: pas ok
    },
    accord: {
        touriste: {
            type: Boolean,
            default: false
        },
        guide: {
            type: Boolean,
            default: false
        }
    },
    datePrevue: {
        type: Date,
    }
},
    {
        timestamps: true
    })