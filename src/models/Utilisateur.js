'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

export const UtilisateurSchema = new Schema({

    nom: {
        type: String,
        required: 'Vous avez oublier de mettre votre nom',
    },
    prenom: {
        type: String,
        required: 'prénom obligatoire'
    },
    tel: {
        type: String,
        required: 'Veuillez entrer un numero telephone'
    },
    email: {
        type: String,
        required: 'Veullez entrer votre email',
    },
    mailVerify: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: 'Veullez entrer un nom  utilisateur ',
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: 'Veuillez entre votre mot de passe'
    },
    type: {
        type: String,
        required: 'Type utilisateur obligatoire'
    },
    localisation: {
        type: String,
    },
    etatConnexion: {
        type: Boolean,
    },
    etatSuppr: {
        type: Boolean,
        default: false,
    },
    pdp: {
        type: String,
    },
    thumbPdp: {
        type: String,
    },
    pdc: {
        type: String,
    },
    thumbPdc: {
        type: String,
    },
    biographie: {
        type: String
    },
    pays:{
        type: String
    },
    dob: {
        jour: { type: Number },
        mois: { type: Number },
        annee: { type: Number }
    },
    address: {
        ville: { type: String },
        adresse: { type: String },
        code_postal: { type: String }
    },
    idStripe: {
        type: String
    }
});
UtilisateurSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};