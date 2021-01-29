import { listUtilisateur,ajouterUtilisateur,utilisateurId, modifierUtilisateur} from '../controllers/UtilisateurController'
import {createAnnonce, findAllAnnonce, findOneAnnonce, updateAnnonce, softdeleteAnnonce, editStateAnnonce} from '../controllers/AnnonceController'
import { createRequete, editStateRequete, findAllRequeteByAnnonce } from '../controllers/RequeteController'

import {    listUtilisateur,
    ajouterUtilisateur,
    utilisateurId, 
    modifierUtilisateur,
    SaveLastLocalisation ,
    softDelete   } from '../controllers/UtilisateurController'
import {ajoutNotification ,modificationNotification } from '../controllers/NotificationControllers'
const route = (app) => {
    // Utilisateur
    app.route ('/utilisateur')
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

    //Notification ajout et modification
    app.route('/notification/')
    .post(ajoutNotification)
    app.route('/notification/:notificationId')
    .put(modificationNotification)
}
export default route;