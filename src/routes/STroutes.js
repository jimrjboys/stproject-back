import { listUtilisateur } from '../controllers/UtilisateurController'
import {
    createAnnonce,
    findAllAnnonce,
    findOneAnnonce,
    updateAnnonce,
    softdeleteAnnonce,
    editStateAnnonce
} from '../controllers/AnnonceController'

const route = (app) => {
    // Utilisateur
    app.route ('/utilisateur')
    .get(listUtilisateur) 

    // Annonce
    app.route('/annonce')
    .get(findAllAnnonce) // lister toutes les annonces
    .post(createAnnonce) // creation annonce
}
export default route;