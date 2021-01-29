import {
    listUtilisateur,
    ajouterUtilisateur,
    utilisateurId,
    modifierUtilisateur,
    SaveLastLocalisation,
    softDelete
} from '../controllers/UtilisateurController'
import {
     ajoutNotification,
     modificationNotification 
} from '../controllers/NotificationControllers'
import {ajoutOpinionUsers,modificationOpinionUsers,softDeleteOpinions} from './../controllers/OpinionUsersControllers'
const route = (app) => {
    // Utilisateur
    app.route('/utilisateur')
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
}
export default route;