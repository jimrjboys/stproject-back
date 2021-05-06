import mongoose from 'mongoose'
import { OpionionUsersSchema } from '../models/OpinionUsers'

const OpinionUsers = mongoose.model('OpinionUsers', OpionionUsersSchema);
const ObjectId = mongoose.Types.ObjectId


export const ajoutOpinionUsers = (req, res) => {

    let nouvelleOpinionsUers = new OpinionUsers(req.body);
    nouvelleOpinionsUers.save((err, nouvelleOpinions) => {

        if (err) {
            return res.send(err)
        }
        res.json(nouvelleOpinions)
    });

}

// fetch opinion by guideId
export const listOpinionUser = (req, res) => {
    OpinionUsers.aggregate([
        {
            $match: {"etatSuppr": false, "guideId": ObjectId(req.params.guideId)}
        },
        {
            $sort: { _id: -1 }
        },
        {
            $lookup:
            {
                "from": "utilisateurs",
                "localField": "touristeId",
                "foreignField": "_id",
                "as": "touriste",
            }
        },
        {
            $unwind: "$touriste"
        },
        {
            $project: {
                "touriste.password": 0
            }
        }
    ])
    .then(opinionUser => {
        let note = 0
        // console.log(opinionUser)
        opinionUser.forEach(opinion => {
            let data = {}

            note += opinion.note
        })

        res.json(
            {
                noteM: note / opinionUser.length,
                opinions: opinionUser
            }
        )
    })
    .catch(err => {
        return res.status(404).send({
            error: true,
            messageError: err
        })
    })
}

export const modificationOpinionUsers = (req, res) => {
    OpinionUsers.findOneAndUpdate({ _id: req.params.opinionId }, req.body, { new: true }, (err, modifOpnionsId) => {
        if (err) {
            res.send(err)
        }
        res.json(modifOpnionsId)

    });
}
export const softDeleteOpinions = (req, res) => {
    OpinionUsers.findOneAndUpdate({ _id: req.params.opinionId }, req.body.etatSuppr, { new: true }, (err, softDeleteOpnionsId) => {
        if (err) {
            res.send(err)
        }
        res.json(softDeleteOpnionsId)

    });
}
