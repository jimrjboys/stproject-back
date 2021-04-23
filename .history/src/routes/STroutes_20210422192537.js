import {
    createOpinionAnnonce,
    findAllOpinionAnnonce,
    updateOpinionAnnonce,
    softDeleteOpinionAnnonce
} from '../controllers/OpinionAnnonceController'
'use strict';

import {
    createAnnonce,
    findAllAnnonce,
    findOneAnnonce,
    updateAnnonce,
    softDeleteAnnonce,
    editStateAnnonce,
    findAnnonceByGuideId
} from '../controllers/AnnonceController'

import {
    createRequete,
    editStateRequete,
    findAllRequeteByAnnonce,
    findReqByIdTouriste,
    cancelRequest
} from '../controllers/RequeteController'

import {
    listUtilisateur,
    ajouterUtilisateur,
    utilisateurId,
    modifierUtilisateur,
    SaveLastLocalisation,
    softDelete,
    Authentification,
    VerificationAuthentification,
    VerificationToken,
    ActiveAccount,
} from '../controllers/UtilisateurController'

import {
    ajoutNotification,
    modificationNotification,
    findAllNotification,
} from '../controllers/NotificationControllers'

import {
    ajoutOpinionUsers,
    modificationOpinionUsers,
    softDeleteOpinions,
    listOpinionUser
} from './../controllers/OpinionUsersControllers'

import {
    newMessages,
    getMesssages
} from '../controllers/MessagesController'

// import media from '../middleware/multer-config'
import multer from 'multer'

const route = (app) => {
    // Utilisateur
    app.route('/utilisateur')
        .get(listUtilisateur)
        .post(ajouterUtilisateur)

    //Utilisateur avec Recheche par ID 
    app.route('/utilisateur/:utilisateurId?')
        .get(utilisateurId)
        .put(modifierUtilisateur)
    //activation du compte après verification email user 
    app.put('/utilisateur/activeAccount/:userId', ActiveAccount)

    // Annonce
    app.route('/annonce/:userId')
        .post((req, res, next) => {
            // console.log("upload sary", req.params.userId)
            // multer(req, res, `${req.params.userId}/annonce`)
            const MIME_TYPES = {
                'image/jpg': 'jpg',
                'image/jpeg': 'jpg',
                'image/png': 'png'
            }

            const dir = `./upload/${req.params.userId}/annonce`;

            const storage = multer.diskStorage({
                destination: (req, file, callback) => {
                    callback(null, dir)
                },
                filename: (req, file, callback) => {
                    const name = file.originalname.split(' ').join('_')
                    const extension = MIME_TYPES[file.mimetype]
                    callback(null, name + Date.now() + '.' + extension)
                }
            })

            // let uploadD = multer({
            //     storage: storage
            // }).array("images")

            let uploadD = multer({
                storage: storage
            }).single("photoAnnonce")

            uploadD(req, res, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    // console.log(req.files)
                    // res.send(res.req.file.filename);
                    // createAnnonce(req, res, req.files)
                    createAnnonce(req, res, req.file)
                }
            })

            // console.log(uploadD)
            // createAnnonce(req, res, uploadD)
            // next()
        })
    app.get('/annonce/annonceGuide/:userId', findAnnonceByGuideId)

    // Annonce use ID
    app.get('/annonce/oneId/:annonceId', findOneAnnonce)
    app.put('/annonce/oneId/:annonceId/:userId?', async (req, res, next) => {
            const MIME_TYPES = {
                'image/jpg': 'jpg',
                'image/jpeg': 'jpg',
                'image/png': 'png'
            }

            const dir = `./upload/${req.params.userId}/annonce`;

            const storage = multer.diskStorage({
                destination: (req, file, callback) => {
                    callback(null, dir)
                },
                filename: (req, file, callback) => {
                    const name = file.originalname.split(' ').join('_')
                    const extension = MIME_TYPES[file.mimetype]
                    callback(null, name + Date.now() + '.' + extension)
                }
            })
            
            let uploadD = await multer({
                storage: storage
            }).single("photoAnnonce")
            
            uploadD(req, res, (err) => {
                if (err) {
                    console.log("MULTER ERROR", err)
                } else {
                    // console.log(req)
                    // res.send(res.req.file.filename);
                    updateAnnonce(req, res, req.file)
                }
            })
        })
    // advanced functionality
    app.put('/annonce/softDeleteAnnonce/:annonceId', softDeleteAnnonce)
    app.put('/annonce/editStateAnnonce/:annonceId', editStateAnnonce)
    app.get('/annonce', findAllAnnonce)

    // Requete
    app.post('/request', createRequete) // create requete
    // Requete use requeteId
    app.put('/request/:requeteId', editStateRequete) // editStateRequete (accepter ou non)
    app.put('/request/cancelRequest/:requeteId', cancelRequest) // annuller requete
    // Requete use annonceId
    app.get('/request/allRequest/:annonceId', findAllRequeteByAnnonce) // get all requete by annonceId
    app.get('/request/allRequestTouriste/:userId', findReqByIdTouriste)

    // Route OpinionAnnonce
    app.post('/opinionAnnonce', createOpinionAnnonce) // add opinion annonce
    app.put('/opinionAnnonce/:OpinionAId', updateOpinionAnnonce) // update opinion annonce
    app.get('/opinionAnnonce/:annonceId', findAllOpinionAnnonce) // get all opionion annonce by annnonceId
    app.put('/opinionAnnonce/softDelete/:OpinionAId', softDeleteOpinionAnnonce) // softDelete opinion annonce

    //sauvegrade du derniere position  de l'utilisateur
    app.route('/localisationActuelle')
        .post(SaveLastLocalisation)

    //supprimer compte utilisateur 
    app.route('/supprime/utilisateur/:utilisateurId')
        .put(softDelete)

    //supprimier opinions softDElete
    app.route('/supprime/opinions/:opinionId')
        .put(softDeleteOpinions)

    //Notification ajout et modification
    app.route('/notification')
        .post(ajoutNotification)
        .get(findAllNotification)
    app.route('/notification/:notificationId')
        .put(modificationNotification)

    //Opinions Ajout et  modification avec softdelte
    app.route('/opinions')
        .post(ajoutOpinionUsers)
    app.get('/opinions/guide/:guideId', listOpinionUser) // fetch opinion guide
    app.route('/opinions/:opinionId')
        .put(modificationOpinionUsers)
    // Authentificatoin et verification du token de connexion  
    //verification de l'etat 
    app.route('/test/verifiEtat')
        .post(VerificationAuthentification)
    //controle du token
    app.route('/test/verifToken')
        .post(VerificationToken)
    //Authentification
    app.route('/auth/signIn')
        .post(Authentification)

    // Systeme de messsages 

    app.route('messages')
        .post(newMessages)
    app.route('messages/:_id')
        .post(getMesssages)
}
export default route;n