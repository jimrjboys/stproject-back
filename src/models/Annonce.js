import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const annonceSchema = new Schema({
    titre: { 
        type: String,
        required: 'titre obligatoire',
    },
    description: {
        type: String,
        required: 'Description obligatoire',
    },
    lieu: {
        type: String,
        required: 'Lieu obligateur'
    },
    localisationAnnonce: {
        type: String,
        required: 'donnée logitude et latitude du lieu est obligatoire',
    },
    etatSuppr: Boolean,
    etatReaparaitre: Boolean,
    photoAnnonce: {
        type: String,
        required: 'photo obligatoire',
    },
    utilisateurId: {
        type: String,
        required: 'auteur obligatoire'
    }
}, {
    timestamps: true
})