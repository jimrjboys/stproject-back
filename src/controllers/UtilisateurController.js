
import { UtilisateurSchema } from '../models/Utilisateur'

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)

export const listUtilisateur = (req, res) => {

    Utilisateur.find({}, (err, utilisateur) => {

        if (err) {
            res.send(err)
        }
        res.json(utilisateur)

    });
}