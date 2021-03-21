'use strict';

import mongoose from 'mongoose';
import bcrypt from  'bcrypt';

const Schema = mongoose.Schema;

export const UtilisateurSchema = new Schema({

    nom: {
        type: String,
        required: 'Vous avez oublier de mettre votre nom',
    },
    prenom: {
        type: String,

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
        lowercase :true , 
        trim: true , 
        unique : true , 
    },
    password: {
        type: String,
        required: 'Veuillez entre votre mot de passe'
    },
    type: {
        type: String,

    },
    localisation: {
        type: String,
    },
    etatConnexion: {
        type: Boolean,
    },
    etatSuppr: {
        type: Boolean,
    },
    pdp: {
        type: String,
    },
});
UtilisateurSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };