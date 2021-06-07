import mongoose from 'mongoose' ;
import { PubliciteSchema } from './../models/Publicite' ; 

const Publicite = mongoose.model('Publicite',PubliciteSchema)

export const publierPublicite = (req, res) => {
Publicite.findOneAndUpdate({ _id: req.params.publiciteId }, req.body, { new: true }, (err, modifPubliciteId) => {
        if (err) {
            res.send(err)
        }
        res.json(modifPubliciteId)
    });
}
export const ajouterPublicite = (req, res) => {
    let nouvellePub = new Publicite(req.body);
    nouvellePub.save((err, newPub) => {
        if (err) {
            res.send(err)
        }

        res.json(newPub)
    });
}

