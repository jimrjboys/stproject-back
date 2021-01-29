import { listUtilisateur,ajouterUtilisateur,utilisateurId, modifierUtilisateur} from '../controllers/UtilisateurController'

const route = (app) => {
    // Utilisateur
    app.route ('/utilisateur')
    .get(listUtilisateur)
    .post(ajouterUtilisateur) 
    
    //Utilisateur avec Recheche par ID 
    app.route('/utilisateur/:utilisateurId')
        .get(utilisateurId)
        .put(modifierUtilisateur)
}
export default route;