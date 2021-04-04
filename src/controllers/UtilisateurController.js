
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { LocalisationSchema } from '../models/Localisation';
import { UtilisateurSchema } from '../models/Utilisateur';

import fs from "fs"

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)
const Localisation = mongoose.model('Localisation', LocalisationSchema)

let transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "c9541a961a07a6",
        pass: "23ed3ae26f3162"
    }
})

let mailOptions = (req, res, email, userId) => ({
    from: '"SpeedTourisme" <speedTourisme@spt.com>',
    to: email,
    subject: 'Verification d\'email',
    text: `Cliquer sur le lien suivant pour activer votre compte!! : ${req.protocol}://${req.get('host')}/utilisateur/activeAccount/${userId}`,
    html: `<a href="${req.protocol}://${req.get('host')}/utilisateur/activeAccount/${userId}?_method=PUT">Verification email</a>`
})

export const listUtilisateur = (req, res) => {

    Utilisateur.find({ etatSuppr: false }, (err, utilisateur) => {

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

    Utilisateur.aggregate([
        {
            $match: {
                $or: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            }
        }
    ])
        .then(response => {
            if (response.length == 0) {
                nouveauxUtilisateur.save((err, newUtilisateur) => {
                    const dir = `./upload/${newUtilisateur._id}`

                    if (err) {
                        return res.send(err)
                    }

                    newUtilisateur.password = undefined

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true }, err => console.log(err))
                        fs.mkdirSync(dir + '/annonce/thumbnail', { recursive: true }, err => console.log(err))
                        fs.mkdirSync(dir + '/pdp/thumbnail', { recursive: true }, err => console.log(err))
                    }

                    // transport.sendMail(mailOptions(req, res, newUtilisateur.email, newUtilisateur._id), (error, info) => {
                    //     if (error) {
                    //         return console.log(error);
                    //     }
                    //     console.log('Message sent: %s', info.messageId);
                    // })
                    let data = {
                        error: false,
                        newUtilisateur: newUtilisateur
                    }
                    res.json(data)
                });
            } else {
                let error = {newUtilisateur: {}}
                response.map(user => {
                    // console.log(user.email, user.username)
                    if (user.username == req.body.username && user.email != req.body.email) {
                        error["error"] = true
                        error["newUtilisateur"]["username"] = "username existe déjà"
                        error["newUtilisateur"]["email"] = ""
                    } else if (user.email == req.body.email && user.username != req.body.username) {
                        error["error"] = true
                        error["newUtilisateur"]["username"] = ""
                        error["newUtilisateur"]["email"] = "email exist déjà"
                    }else if(user.email == req.body.email && user.username == req.body.username){
                        error["error"] = true
                        error["newUtilisateur"]["username"] = "username existe déjà"
                        error["newUtilisateur"]["email"] = "email exist déjà"
                    }
                })
                return res.json(error)
            }
        })
        .catch(err => {
            return console.log(err)
        })
}
export const utilisateurId = (req, res) => {
    Utilisateur.findById({ _id: req.params.utilisateurId }, (err, searchUtilisateurId) => {
        if (err) {
            return res.send(err)
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
        return res.json({ token: jwt.sign({ email: utilisateur.email, username: utilisateur.username, _id: utilisateur._id, mailVerify: utilisateur.mailVerify, expiresIn: 31556926  , success : true}, 'RESTFULAPIs') });
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

export const ActiveAccount = (req, res) => {
    // console.log(req.params.userId)
    Utilisateur.findByIdAndUpdate(req.params.userId, {
        mailVerify: true
    }, { new: true })
        .then(() => {
            const data = {
                error: false,
                message: "Compte activer"
            }
            res.json(data)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    error: true,
                    message: "Annonce not found with id " + req.params.utilisateurId
                })
            }
            return res.status(500).send({
                error: true,
                message: "Erreur lors de l'activation du compte " + req.params.utilisateurId
            })
        })
}