
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { LocalisationSchema } from '../models/Localisation';
import { UtilisateurSchema } from '../models/Utilisateur';
import sharp from 'sharp'

import fs from "fs"
// import {google} from 'googleap is'
require("dotenv").config();

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)
const Localisation = mongoose.model('Localisation', LocalisationSchema)

// const OAuth2 = google.auth.OAuth2

// const createTransporter = async () => {
//     const oauth2Client = new OAuth2(
//         process.env.CLIENT_ID,
//         process.env.CLIENT_SECRET,
//         "https://developers.google.com/oauthplayground"
//     );

//     oauth2Client.setCredentials({
//         refresh_token: process.env.REFRESH_TOKEN
//     });

//     const accessToken = await new Promise((resolve, reject) => {
//         console.log(process.env.REFRESH_TOKEN)
//         oauth2Client.getAccessToken((err, token) => {
//             if (err) {
//                 reject("Failed to create access token :(");
//             }
//             resolve(token);
//         });
//     });

//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             type: "OAuth2",
//             user: process.env.EMAIL,
//             accessToken,
//             clientId: process.env.CLIENT_ID,
//             clientSecret: process.env.CLIENT_SECRET,
//             refreshToken: process.env.REFRESH_TOKEN
//         }
//     });

//     return transporter;
// };

// const sendEmail = async (email, userId) => {
//     let emailTransporter = await createTransporter();
//     await emailTransporter.sendMail({
//         subject: "Email Verify",
//         from: process.env.EMAIL,
//         to: email,
//         text: `Click this link to validate ${email}`,
//         html: `<a href="http://localhost:3000/verifyMail/${userId}">Cliquer moi</a>`
//     });
// };

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
    text: `Cliquer sur le lien suivant pour activer votre compte!!`,
    html: `Merci de verifier votre compte en cliquant sur le lien!!!!! <a href="http://localhost:3000/verifyMail/${userId}">Verification email</a>`
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

                    transport.sendMail(mailOptions(req, res, newUtilisateur.email, newUtilisateur._id), (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                    })
                    // sendEmail(newUtilisateur.email, newUtilisateur._id)
                    //     .then(() => {
                    //         console.log('Message sent: %s', info.messageId)
                    //     })
                    //     .catch(err => {
                    //         console.log(err)
                    //     })

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
        searchUtilisateurId.password = undefined
        res.json(searchUtilisateurId)

    });
}

export const findUserByEmail = (req, res) => {
    Utilisateur.findOne({'email': req.body.email }, {projection:{ _id: 0 }})
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
        if(error){
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
    // let user = new Utilisateur(req.body)
    // console.log(req.body)
    let data = {
        user: req.body
    }

    if(req.files){
        let makeThumbPdp = "", makeThumbPdc = ""
        if(req.files.pdp[0]){
            makeThumbPdp = await sharp(`./upload/${req.params.utilisateurId}/pdp/${req.files.pdp[0].filename}`).resize(800, 720).jpeg({ quality: 72 }).toFile(`./upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdp[0].filename}_thumb.jpg`)
            if(makeThumbPdp){
                data["user"]["pdp"] = `upload/${req.params.utilisateurId}/pdp/${req.files.pdp[0].filename}`
                data["user"]["thumbPdp"] = `upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdp[0].filename}_thumb.jpg`
            }
        }

        if(req.files.pdc[0]){
            makeThumbPdc = await sharp(`./upload/${req.params.utilisateurId}/pdp/${req.files.pdc[0].filename}`).resize(800, 720).jpeg({ quality: 72 }).toFile(`./upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdc[0].filename}_thumb.jpg`)
            if(makeThumbPdc){
                data["user"]["pdc"] = `upload/${req.params.utilisateurId}/pdp/${req.files.pdc[0].filename}`
                data["user"]["thumbPdc"] = `upload/${req.params.utilisateurId}/pdp/thumbnail/${req.files.pdc[0].filename}_thumb.jpg`
            }
        }

    }
    
    if(req.body.password){
        const saltRounds = 10
        data["user"]["password"] = bcrypt.hashSync(req.body.password, saltRounds)
    }
    
    Utilisateur.findOneAndUpdate({ _id: req.params.utilisateurId }, data.user, { new: true }, (err, modifUtilisateurId) => {
        if (err) {
            return res.send(err)
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

    Utilisateur.findOne({$or: [{ email: req.body.email }, { username: req.body.email }]}, (err, utilisateur) => {
        if (err) throw err;
        if (!utilisateur || !utilisateur.comparePassword(req.body.password)) {
            console.log(req.body.email)
            return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
        }
        return res.json({ token: jwt.sign({ email: utilisateur.email, username: utilisateur.username, _id: utilisateur._id, mailVerify: utilisateur.mailVerify, expiresIn: 31556926, success : true}, 'RESTFULAPIs') });
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