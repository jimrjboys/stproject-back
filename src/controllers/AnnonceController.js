import mongoose from 'mongoose';
import { annonceSchema } from '../models/Annonce';

const Annonce = mongoose.model('Annonce', annonceSchema)

// create and save annonce
export const createAnnonce = (req, res) => {
    let AnnonceCreate = new Annonce(req.body);
    AnnonceCreate.save((err, annonce) => {
        if(err){
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Annonce"
            });
        }

        res.json(annonce)
    })
};

// retrieve and return all annonces
export const findAllAnnonce = (req, res) => {
    Annonce.find()
        .then(annonces => {
            res.send(annonces)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Une erreur s'est produit lors de la récuperation des annonces"
            })
        })
}

// find single annonce with annonceId
export const findOneAnnonce = (req, res) => {
    Annonce.findById(req.params.annonceId)
        .then(annonce => {
            if(!annonce){
                return res.status(404).send({
                    message: "Annonce not found"
                })
            }
            res.send(annonce)
        })
        .catch(err => {
            if(err.kind === "ObjectId"){
                return res.status(404).send({
                    message: "Annonce not found with id"
                })
            }
        })
}

// update annonce by id
export const updateAnnonce = (req, res) => {
    Annonce.findByIdAndUpdate(req.params.annonceId, req.body, {new: true})
        .then(annonce => {
            res.send(annonce)
        })
        .catch(err => {
            if(err.kind === "ObjectId"){
                return res.status(404).send({
                    message: "Annonce not found with id " + req.params.annonceId
                })
            }

            return res.status(500).send({
                message: "Error updating note with id " + req.params.annonceId
            })
        })
} 

// softdelete annonce
export const softdeleteAnnonce = (req, res) => {
    Annonce.findByIdAndUpdate(req.params.annonceId, {
        etatSuppr: req.body.etatSuppr
    }, {new: true})
    .then(annonce => {
        res.send(annonce)
    })
    .catch(err => {
        if(err.kind === "ObjectId"){
            return res.status(404).send({
                message: "Annonce not found with id " + req.params.annonceId
            })
        }
        return res.status(500).send({
            message: "Error updating annonce with id " + req.params.annonceId
        })
    })
}

// modification etat d'annonce (disparaitre et réaparaître)
export const editStateAnnonce = (req, res) => {
    Annonce.findByIdAndUpdate(req.params.annonceId, {
        etatReaparaitre: req.body.etatReaparaitre
    }, {new: true})
    .then(annonce => {
        res.send(annonce)
    })
    .catch(err => {
        if(err.kind === "ObjectId"){
            return res.status(404).send({
                message: "Annonce not found with id " + req.params.annonceId
            })
        }
        return res.status(500).send({
            message: "Error updating annonce with id " + req.params.annonceId
        })
    })
}
