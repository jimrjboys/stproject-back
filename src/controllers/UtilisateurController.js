
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { LocalisationSchema } from '../models/Localisation';
import { UtilisateurSchema } from '../models/Utilisateur';
import sharp from 'sharp'

import fs from "fs"
require("dotenv").config();

const ObjectId = mongoose.Types.ObjectId
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)
const Localisation = mongoose.model('Localisation', LocalisationSchema)

let transport = nodemailer.createTransport({
    host: process.env.host_mail,
    port: process.env.port_mail,
    auth: {
        user: process.env.user_mail,
        pass: process.env.password_mail
    }
})

let mailOptions = (req, res, email, message, html = '') => ({
    from: '"SpeedTourism-NoReply" <noreply@speedtourism.fr>',
    to: email,
    subject: 'Verification d\'email',
    text: message,
    html: html
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

                    const message = `Cliquer sur le lien suivant pour activer votre compte!!`
                    const html = `Merci de verifier votre compte en cliquant sur le lien!!!!! <a href="http://localhost:3000/verifyMail/${newUtilisateur._id}">Verification email</a>`
                    transport.sendMail(mailOptions(req, res, newUtilisateur.email, message, html), (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                    })

                    let data = {
                        error: false,
                        newUtilisateur: newUtilisateur
                    }
                    res.json(data)
                });
            } else {
                let error = { newUtilisateur: {} }
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
                    } else if (user.email == req.body.email && user.username == req.body.username) {
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

        let data = {}

        data = searchUtilisateurId
        data['pdp'] = `${req.protocol}://${req.get('host')}/${searchUtilisateurId.pdp}`
        data['thumbPdp'] = `${req.protocol}://${req.get('host')}/${searchUtilisateurId.thumbPdp}`
        data['pdc'] = `${req.protocol}://${req.get('host')}/${searchUtilisateurId.pdc}`
        data['thumbPdc'] = `${req.protocol}://${req.get('host')}/${searchUtilisateurId.thumbPdc}`

        searchUtilisateurId.password = undefined
        res.json(data)

    });
}

export const findUserByEmail = (req, res) => {
    Utilisateur.findOne({ 'email': req.body.email }, { projection: { _id: 0 } })
        .then(response => {
            const data = {
                error: false,
                data: response,
                message: "email trouvé"
            }
            res.json(data)
        })
        .catch(err => {
            const data = {
                error: true,
                data: "",
                message: "email non trouvé"
            }
            return res.json(err)
        })
}

let mailResetPassword = (email, userId) => ({
    from: '"SpeedTourisme" <speedTourisme@spt.com>',
    to: email,
    subject: 'Reinitialisation mot de passe',
    text: 'Vous pouvez réinitialiser votre mot de passe',
    html: `Merci de cliquer sur le lien suivant pour réinitialiser votre mot de passe!!!! <a href="http://localhost:3000/resetPassword/${userId}">Réinitialiser MDP</a>`
})

export const sendMailResetPassword = (req, res) => {
    transport.sendMail(mailResetPassword(req.body.email, req.params.userId), (error, info) => {
        let data = {}
        if (error) {
            data = {
                error: true,
                message: "Une erreur est survenue lors de l'envoie de l'email"
            }

            return res.json(data)
        }

        data = {
            error: false,
            message: "Email reinitialisation mdp envoyé"
        }

        res.json(data)
    })
}

export const modifierUtilisateur = async (req, res) => {

    Utilisateur.aggregate([
        {
            $match: {
                _id: { $ne: ObjectId(req.params.utilisateurId) },
                $or: [
                    { username: req.body.username },
                    { email: req.body.email }
                ],
            }
        }
    ])
        .then(async response => {
            if (response.length != 0) {
                let data = {
                    user: {}
                }

                response.map(user => {
                    // console.log(user.email == req.body.email) 
                    if (user.username == req.body.username && user.email != req.body.email) {
                        console.log(user.username == req.body.username)
                        data["error"] = true
                        data["user"]["username"] = "username existe déjà"
                        data["user"]["email"] = ""
                    } else if (user.email == req.body.email && user.username != req.body.username) {
                        data["error"] = true
                        data["user"]["username"] = ""
                        data["user"]["email"] = "email exist déjà"
                    } else if (user.email == req.body.email && user.username == req.body.username) {
                        data["error"] = true
                        data["user"]["username"] = "username existe déjà"
                        data["user"]["email"] = "email exist déjà"
                    }
                })

                res.json(data)

            } else {
                let data = {
                    user: req.body
                }
                if (req.body.password) {
                    const saltRounds = 10
                    data["user"]["password"] = bcrypt.hashSync(req.body.password, saltRounds)
                }

                if (req.body.biographie) {
                    data["user"]["biographie"] = req.body.biographie
                }

                Utilisateur.findByIdAndUpdate({ _id: req.params.utilisateurId }, data.user, { new: true }, (err, modifUtilisateurId) => {
                    if (err) {
                        return res.send(err)
                    }
                    let result = {
                        error: false,
                        user: modifUtilisateurId
                    }
                    res.json(result)

                });
            }
        })
        .catch(err => {
            // let data = {
            //     error: false,
            //     user: req.body
            // }
            return res.json(err)
        })
}

export const uploadProfil = async (req, res) => {
    let data = {}

    if (req.files.pdp != null) {
        try {
            let makeThumbPdp = await sharp(`./upload/${req.params.utilisateurId}/pdp/${req.files.pdp[0].filename}`).resize(800, 720).jpeg({ quality: 72 }).toFile(`./upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdp[0].filename}_thumb.jpg`)
            if (makeThumbPdp) {
                data["pdp"] = `upload/${req.params.utilisateurId}/pdp/${req.files.pdp[0].filename}`
                data["thumbPdp"] = `upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdp[0].filename}_thumb.jpg`
            }
        } catch (error) {
            data["error"] = true
            data["message"] = error.message
            return res.json(data)
        }
    }

    if (req.files.pdc != null) {
        try {
            let makeThumbPdc = await sharp(`./upload/${req.params.utilisateurId}/pdp/${req.files.pdc[0].filename}`).resize(800, 720).jpeg({ quality: 72 }).toFile(`./upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdc[0].filename}_thumb.jpg`)
            if (makeThumbPdc) {
                data["pdc"] = `upload/${req.params.utilisateurId}/pdp/${req.files.pdc[0].filename}`
                data["thumbPdc"] = `upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdc[0].filename}_thumb.jpg`
            }   
        } catch (error) {
            data["error"] = true
            data["message"] = error.message
            return res.json(data)
        }
    }

    Utilisateur.findByIdAndUpdate({ _id: req.params.utilisateurId }, data, { new: true }, (err, modifUtilisateurId) => {
        if (err) {
            return res.json({error: err})
        }
        let result = {
            error: false,
            user: modifUtilisateurId
        }
        res.json(result)
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

    Utilisateur.findOne({ $or: [{ email: req.body.email }, { username: req.body.email }] }, (err, utilisateur) => {
        if (err) throw err;
        if (!utilisateur || !utilisateur.comparePassword(req.body.password)) {
            console.log(req.body.email)
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        return res.json({ token: jwt.sign({ email: utilisateur.email, username: utilisateur.username, _id: utilisateur._id, mailVerify: utilisateur.mailVerify, expiresIn: 31556926, success: true }, 'RESTFULAPIs') });
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