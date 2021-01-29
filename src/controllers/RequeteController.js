import mongoose from 'mongoose'
import { RequeteSchema } from '../models/Requete'

const Requete = mongoose.model('Requete', RequeteSchema)

// create and save requete
export const createRequete = (req, res) => {
    let requete = Requete(req.body)

    requete.save((err, requete) => {
        if(err){
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Request"
            });
        }

        res.json(requete)
    })
}

// editStateRequete
export const editStateRequete = (req, res) => {
    Requete.findByIdAndUpdate(req.params.requeteId, {
        etatRequete: req.body.etatSuppr
    }, {new: true})
    .then(requete => {
        res.send(requete)
    })
    .catch(err => {
        if(err.kind == "ObjectId"){
            return res.status(404).send({
                message: "Requete not found with id " + req.params.requeteId
            })
        }
        return res.status(500).send({
            message: "Error updating requete with id " + req.params.requeteId
        })
    })
}

// retrieve all requete By AnnonceId
export const findAllRequeteByAnnonce = (req, res) => {
    Requete.findById(req.params.annonceId)
        .then(requete => {
            if(!requete){
                return res.status(404).send({
                    message: "Requete not found"
                })
            }
            res.send(requete)
        })
        .catch(err => {
            if(err.kind === "ObjectId"){
                return res.status(404).send({
                    message: "Requete not found with id"
                })
            }
        })
}