import mongoose from 'mongoose'
import { requeteSchema } from '../models/Requete'

const Requete = mongoose.model('Requete', requeteSchema)

// create and save requete
export const createRequete = (req, res) => {
    let requete = Requete(req.body)

    requete.save((err, requete) => {
        if (err) {
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
        etatRequete: req.body.etatRequete
    }, { new: true })
        .then(requete => {
            res.json(requete)
        })
        .catch(err => {
            if (err.kind == "ObjectId") {
                return res.status(404).send({
                    message: "Requete not found with id " + req.params.requeteId
                })
            }
            return res.status(500).send({
                message: "Error updating requete with id " + req.params.requeteId
            })
        })
}

// retrieve all requete By AnnonceId (utilisé plus par le guide)
export const findAllRequeteByAnnonce = (req, res) => {
    Requete.find({"annonceId": req.params.annonceId, "etatAnnulation": false, "etatRequete": true})
        .then(requete => {
            if (!requete) {
                return res.status(404).send({
                    message: "Requete not found"
                })
            }
            res.json(requete)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Requete not found with id"
                })
            }
            return res.json(err)
        })
}

// get all request make by touriste
export const findReqByIdTouriste = (req, res) => {
    Requete.find({"touristeId": req.params.userId})
        .then(requete => {
            res.json(requete)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Requete not found with id"
                })
            }
            res.send(err)
        })
}

// cancel request (make by touriste)
export const cancelRequest = (req, res) => {
    Requete.findByIdAndUpdate(req.params.requeteId, {
        etatAnnulation: req.body.etatAnnulation
    }, { new: true })
        .then(requete => {
            res.json(requete)
        })
        .catch(err => {
            if (err.kind == "ObjectId") {
                return res.status(404).send({
                    message: "Requete not found with id " + req.params.requeteId
                })
            }
            return res.status(500).send({
                message: "Error updating requete with id " + req.params.requeteId
            })
        })
}