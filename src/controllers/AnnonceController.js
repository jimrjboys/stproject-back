import mongoose, { mongo } from 'mongoose';
import { AnnonceSchema } from '../models/Annonce';

const annonce = mongoose.model('Annonce', AnnonceSchema)

// create and save annonce
exports.create = (req, res) => {
    // validate request
    if(!req.body.content){
        return res.status(400).send({
            message: "Annonce ne peut être vide"
        })
    }

    // Create note
    const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    })

    // save note in the databas
    note.save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note"
            });
        })

};