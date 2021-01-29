
import mongoose from 'mongoose';
import { LocalisationSchema } from '../models/Localisation';
import { UtilisateurSchema } from '../models/Utilisateur';
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)
const Localisation = mongoose.model('Localisation', LocalisationSchema)

export const listUtilisateur = (req,res) => {

    Utilisateur.find({}, (err, utilisateur) => {

        if (err) {
            res.send(err)
        }
        res.json(utilisateur)

    });
}
export const ajouterUtilisateur = (req , res) => {
    let nouveauxUtilisateur = new Utilisateur(req.body);
    nouveauxUtilisateur.save((err, newUtilisateur) => {
        if (err) {
            res.send(err)
        }

        res.json(newUtilisateur)
    });
}
export const utilisateurId = (req, res ) => {
    Utilisateur.findById({ _id: req.params.utilisateurId }, (err, searchUtilisateurId) => {
        if (err) {
            res.send(err)
        }
        res.json(searchUtilisateurId)

    });
}
export const modifierUtilisateur = (req ,res ) => {

    Utilisateur.findOneAndUpdate({ _id: req.params.utilisateurId }, req.body, { new: true }, (err, modifUtilisateurId) => {
        if (err) {
            res.send(err)
        }
        res.json(modifUtilisateurId)

    });
}
export const softDelete = (res  ,req ) => {
    
    Utilisateur.findOneAndUpdate({ _id: req.params.utilisateurId }, req.body.etatSuppr, { new: true }, (err, modifSoftDelete) => {
        if (err) {
            res.send(err)
        }
        res.json(modifSoftDelete)

    });
}
export const SaveLastLocalisation = (req , res) => {
    let nouvelleLocalisation = new Localisation(req.body);
    nouvelleLocalisation.save((err, newLocalisation) => {
        if (err) {
            res.send(err)
        }

        res.json(newLocalisation)
    });
}
