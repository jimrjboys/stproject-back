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
        type: Number, //0: en attente, 1: ok, 2: pas ok, 3: terminer
    },
    accord: {
        touriste: {
            type: Date
        },
        guide: {
            type: Date
        }
    },
    InfoPrix: {
        prixRequete: {
            type: Number
        },
        accordPrix: {
            type: Boolean,
            default: true
        }
    },
    conversationId: {
        type: Schema.ObjectId,
        ref: 'requetes',
        required: 'id requete obligatoire'
    },
    absence: {
        touriste: {
            type: Boolean,
            default: false
        },
        guide: {
            type: Boolean,
            default: false
        }
    },
    circuit: {
        debutCircuit: {
            type: Date
        },
        finCircuit: {
            type: Date
        }
    }
},
    {
        timestamps: true
    })