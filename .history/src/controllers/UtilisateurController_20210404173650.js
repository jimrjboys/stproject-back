
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { LocalisationSchema } from '../models/Localisation';
import { UtilisateurSchema } from '../models/Utilisateur';

import fs from "fs"

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)
const Localisation = mongoose.model('Localisation', LocalisationSchema)

export const listUtilisateur = (req, res) => {

    Utilisateur.find({}, (err, utilisateur) => {

        if (err) {
            res.send(err)
        }
        res.json(utilisateur)

    });
}
export const ajouterUtilisateur = (req, res) => {
    let nouveauxUtilisateur = new Utilisateur(req.body);
    const saltRounds = 10

    nouveauxUtilisateur.password = bcrypt.hashSync(req.body.password, saltRounds)

    nouveauxUtilisateur.save((err, newUtilisateur) => {
        const dir = `./upload/${newUtilisateur._id}`

        if (err) {
            res.send(err)
        }

        newUtilisateur.password = undefined

        res.json(newUtilisateur)
        
        if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true }, err => console.log(err))
                fs.mkdirSync(dir+'/annonce/thumbnail', { recursive: true }, err => console.log(err))
                fs.mkdirSync(dir+'/pdp/thumbnail', { recursive: true }, err => console.log(err))
        }
    });
}
export const utilisateurId = (req, res) => {
    Utilisateur.findById({ _id: req.params.utilisateurId }, (err, searchUtilisateurId) => {
        if (err) {
            res.send(err)
        }
        res.json(searchUtilisateurId)

    });
}
export const modifierUtilisateur = (req, res) => {

    Utilisateur.findOneAndUpdate({ _id: req.params.utilisateurId }, req.body, { new: true }, (err, modifUtilisateurId) => {
        if (err) {
            res.send(err)
        }
        res.json(modifUtilisateurId)

    });
}
export const softDelete = (res, req) => {

    Utilisateur.findOneAndUpdate({ _id: req.params.utilisateurId }, req.body.etatSuppr, { new: true }, (err, modifSoftDelete) => {
        if (err) {
            res.send(err)
        }
        res.json(modifSoftDelete)

    });
}
export const SaveLastLocalisation = (req, res) => {
    let nouvelleLocalisation = new Localisation(req.body);
    nouvelleLocalisation.save((err, newLocalisation) => {
        if (err) {
            res.send(err)
        }

        res.json(newLocalisation)
    });
}
export const Authentification = (req, res) => {

    Utilisateur.findOne({ email: req.body.email }, (err, utilisateur) => {
        if (err) throw err;
        if (!utilisateur || !utilisateur.comparePassword(req.body.password)) {
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        return res.json({ token: jwt.sign({ email: utilisateur.email, username: utilisateur.username, _id: utilisateur._id ,   expiresIn: 31556926 }, 'RESTFULAPIs') });
    });
};
export const VerificationAuthentification = (req, res, next) => {
    if (req.utilisateur) {
        next();
    } else {

        return res.status(401).json({ message: 'Unauthorized user!!' });
    }

};
export const VerificationToken = (req, res, next) => {
    if (req.utilisateur) {
        res.send(req.utilisateur);
        next();
    }
    else {
        return res.status(401).json({ message: 'Invalid token' });
    }

};