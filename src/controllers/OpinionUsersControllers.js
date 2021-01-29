import mongoose from 'mongoose'
import { OpionionUsersSchema  } from './../models/OpinionUsers'

const OpinionUsers = mongoose.model('OpinionUsers',OpionionUsersSchema)  ; 

export const  ajoutOpinionUsers = (req , res) => {

    let nouvelleOpinionsUers = new OpinionUsers (req.body);
    nouvelleOpinionsUers.save((err,nouvelleOpinions ) => {

        if (err) {
            res.send(err)
        }

        res.json(nouvelleOpinions)
    });

}
export const modificationOpinionUsers = (req , res) =>{
    OpinionUsers.findOneAndUpdate({ _id: req.params.opinionId }, req.body, { new: true }, (err, modifOpnionsId) => {
        if (err) {
            res.send(err)
        }
        res.json(modifOpnionsId)

    });
}
export const softDeleteOpinions = (req,res ) => {
    OpinionUsers.findOneAndUpdate({ _id: req.params.opinionId }, req.body.etatSuppr, { new: true }, (err, softDeleteOpnionsId) => {
        if (err) {
            res.send(err)
        }
        res.json(softDeleteOpnionsId)

    });
}
