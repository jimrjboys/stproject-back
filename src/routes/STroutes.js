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