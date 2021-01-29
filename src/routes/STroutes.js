import { listUtilisateur } from '../controllers/UtilisateurController'

const route = (app) => {
    // Utilisateur
    app.route ('/utilisateur')
    .get(listUtilisateur) 
}
export default route;