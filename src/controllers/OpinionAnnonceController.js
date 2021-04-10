import mongoose from 'mongoose'
import { opinionAnnonceSchema } from '../models/OpinionAnnonce'
// import 'core-js/stable'

const OpinionAnnonce = mongoose.model('OpinionAnnonce', opinionAnnonceSchema)

// create and save opinion
export const createOpinionAnnonce = (req, res) => {
    let OpinionA = new OpinionAnnonce(req.body)

    OpinionA.save((err, opinionAnnonce) => {
        if(err){
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Opinion Annonce"
            })
        }

        res.json(opinionAnnonce)
    })
}

// retrieve and return all opinion by annonceId
export const findAllOpinionAnnonce = (req, res) => {
    OpinionAnnonce.find({annonceId: req.params.annonceId, etatSuppr: false})
        .then(opinionA => {
            if(!opinionA){
                return res.status(404).send({
                    message: "No data about opinion"
                })
            }
            res.json(opinionA)
        })
        .catch(err => {
            if(err.kind === "ObjectId"){
                return res.status(404).send({
                    message: "Opinion not found with id"
                })
            }
        })
}

// update opinionAnnonce by id
export const updateOpinionAnnonce = (req, res) => {
    OpinionAnnonce.findByIdAndUpdate(req.params.OpinionAId, req.body, {new: true})
        .then(opinionA => {
            res.json(opinionA)
        })
        .catch(err => {
            if(err.kind === "ObjectId"){
                return res.status(404).send({
                    message: "Opinion Annonce not found with id " + req.params.OpinionAId
                })
            }

            return res.status(500).send({
                message: "Error updating Opinion with id " + req.params.OpinionAId
            })
        })
}

// softDelete opinionAnnonce
export const softDeleteOpinionAnnonce = (req, res) => {
    OpinionAnnonce.findByIdAndUpdate(req.params.OpinionAId, {
        etatSuppr: true
    }, {new: true})
    .then(opinionA => {
        res.json(opinionA)
    })
    .catch(err => {
        if(err.kind === "ObjectId"){
            return res.status(404).send({
                message: "Opinion Annonce not found with id " + req.params.OpinionAId
            })
        }

        return res.status(500).send({
            message: "Error updating annonce with id " + req.params.OpinionAId
        })
    })
}