'use strict'
import mongoose from 'mongoose';

const Schema = mongoose.Schema

export const AnnonceSchema = new Schema({
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
    latitude: {
        type: String,
        required: 'donnée latitude du lieu est obligatoire',
    },      
    longitude: {
        type: String,
        required: 'donnée logitude du lieu est obligatoire',
    },
    etatSuppr: {
        type: Boolean,
        default: false,
    },
    etatReaparaitre: {
        type: Boolean,
        default: true,
    },
    // images: [],
    photoAnnonce: {
        type: String,
        required: 'photo obligatoire',
    },
    thumbAnnonce: {
        type: String
    },
    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: 'auteur obligatoire'
    }
}, {
    timestamps: true
})