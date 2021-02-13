import mongoose from 'mongoose';

export const annonceSchema = mongoose.Schema({
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
    etatSuppr: {
        type: Boolean,
        default: false,
    },
    etatReaparaitre: {
        type: Boolean,
        default: false,
    },
    photoAnnonce: {
        type: String,
        required: 'photo obligatoire',
    },
    thumbAnnonce: String,
    utilisateurId: {
        type: String,
        required: 'auteur obligatoire'
    }
}, {
    timestamps: true
})