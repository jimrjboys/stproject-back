'use strict';

import {
    createAnnonce,
    findAllAnnonce,
    findOneAnnonce,
    updateAnnonce,
    softdeleteAnnonce,
    editStateAnnonce
} from '../controllers/AnnonceController'
import {
    createRequete,
    editStateRequete,
    findAllRequeteByAnnonce
} from '../controllers/RequeteController'

import {
    listUtilisateur,
    ajouterUtilisateur,
    utilisateurId,
    modifierUtilisateur,
    SaveLastLocalisation,
    softDelete ,
    Authentification ,
    VerificationAuthentification ,
    VerificationToken,

} from '../controllers/UtilisateurController'
import {
    ajoutNotification,
    modificationNotification
} from '../controllers/NotificationControllers'
import {
    ajoutOpinionUsers,
    modificationOpinionUsers,
    softDeleteOpinions
} from './../controllers/OpinionUsersControllers'
const route = (app) => {
    // Utilisateur
    app.route('/utilisateur')
        .get(listUtilisateur)
        .post(ajouterUtilisateur)

    //Utilisateur avec Recheche par ID 
    app.route('/utilisateur/:utilisateurId')
        .get(utilisateurId)
        .put(modifierUtilisateur)

    // Annonce
    app.route('/annonce')
        .get(findAllAnnonce)
        .post(createAnnonce)
    // Annonce use ID
    app.route('/annonce/:annonceId')
        .get(findOneAnnonce)
        .put(updateAnnonce)
    // advanced functionality
    app.put('/annonce/softDeleteAnnonce/:annonceId', softdeleteAnnonce)
    app.put('/annonce/editStateAnnonce/:annonceId', editStateAnnonce)

    // Requete
    app.route('/requete')
        .post(createRequete)
    // Requete use requeteId
    app.route('/requete/:requeteId')
        .put(editStateRequete)
    // Requete use annonceId
    app.route('/requete/allRequete/:annonceId')
        .get(findAllRequeteByAnnonce)

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
    app.route('/notification/')
        .post(ajoutNotification)
    app.route('/notification/:notificationId')
        .put(modificationNotification)

    //Opinions Ajout et  modification avec softdelte
    app.route('/opinions')
        .post(ajoutOpinionUsers)
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
}
export default route;