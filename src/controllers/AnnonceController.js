import mongoose from 'mongoose'
import { AnnonceSchema } from '../models/Annonce'
import { UtilisateurSchema } from '../models/Utilisateur';
import sharp from 'sharp'
import "regenerator-runtime/runtime";

const Annonce = mongoose.model('Annonce', AnnonceSchema)
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)

// create and save annonce
export const createAnnonce = async (req, res, files) => {
    // console.log("create annonce", files)

    let AnnonceCreate = new Annonce(req.body)
    let arrayImages = []
    try {
        await Promise.all(
            files.map(async file => {
                try {
                    let makeThumb = await sharp(`./upload/${req.params.userId}/annonce/${file.filename}`).resize(200, 300).jpeg({ quality: 80 }).toFile(`./upload/${req.params.userId}/annonce/thumbnail/${file.filename}_thumb.jpg`)
                    let objectImages = {}
                    if (makeThumb) {
                        objectImages["photoAnnonce"] = `upload/${req.params.userId}/annonce/${file.filename}`
                        objectImages["thumbAnnonce"] = `upload/${req.params.userId}/annonce/thumbnail/${file.filename}_thumb.jpg`
                        arrayImages.push(objectImages)
                        AnnonceCreate.images = arrayImages
                    }

                } catch (err) {
                    console.log("error sharp", err)
                }
            })
        )
    } catch (error) {
        console.log(error)
    }

    AnnonceCreate.save((err, data) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Annonce"
            });
        }
        res.json(data)
    })
};

/**
 * retrieve and return all annonces
 * accès à la pagination http://localhost:3000/annonce?page=2&limit=1 
*/
export const findAllAnnonce = async (req, res) => {
    const page = parseInt(req.query.page),
        limit = parseInt(req.query.limit),
        skipIndex = (page - 1) * limit,
        results = {}

    try {
        const lieu = req.query.search
        let condition = lieu ? { "lieu": { $regex: lieu, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true } : { "etatSuppr": false, "etatReaparaitre": true }
        let total = await Annonce.aggregate([
            {
                $match: condition
            },
            {
                $lookup:
                {
                    "from": "utilisateurs",
                    "localField": "utilisateurId",
                    "foreignField": "_id",
                    "as": "user_info"
                },

            }, {
                $unwind: "$user_info"
            },
            {
                $lookup: {
                    from: "opinionusers",
                    localField: "utilisateurId",
                    foreignField: "guideId",
                    as: "opinion_users"
                }
            }])
        // .sort({ _id: -1 })
        total = total.length
        let totalPage = Math.ceil(total / limit)
        // var newAnnonce = []

        Annonce.aggregate([
            {
                $match: condition
            },
            {
                $lookup:
                {
                    "from": "utilisateurs",
                    "localField": "utilisateurId",
                    "foreignField": "_id",
                    "as": "user_info"
                },

            }, {
                $unwind: "$user_info"
            },
            {
                $lookup: {
                    from: "opinionusers",
                    localField: "utilisateurId",
                    foreignField: "guideId",
                    as: "opinion_users"
                }
            }, {
                $skip: skipIndex
            }, {
                $limit: limit
            }, {
                $sort: { _id: -1 }
            },
        ])
            // .limit(limit)
            // .skip(skipIndex)
            .then(annonces => {
                let note = 0
                let newAnnonce = []
                // console.log('debut', annonces)
                annonces.forEach(annonce => {
                    let data = {
                        annonces: {},
                        guide: {}
                    }
                    let countOpinion = 0

                    let dataImages = {}, newImages = []

                    countOpinion = annonce.opinion_users.length
                    annonce.opinion_users.forEach(opinion => {
                        note += opinion.note
                    })
                    // console.log(`${note} / ${countOpinion}`,note / countOpinion, annonce)
                    data["noteMoyenGuide"] = note / countOpinion

                    data["guide"]["id"] = annonce.user_info._id
                    data["guide"]["nom"] = annonce.user_info.nom
                    data["guide"]["prenom"] = annonce.user_info.prenom
                    data["guide"]["tel"] = annonce.user_info.tel
                    data["guide"]["email"] = annonce.user_info.email
                    data["guide"]["username"] = annonce.user_info.username

                    data["annonces"]["id"] = annonce._id
                    data["annonces"]["titre"] = annonce.titre
                    data["annonces"]["description"] = annonce.description
                    data["annonces"]["lieu"] = annonce.lieu
                    data["annonces"]["localisationAnnonce"] = annonce.localisationAnnonce
                    annonce.images.forEach(item => {
                        dataImages["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${item.photoAnnonce}`
                        dataImages["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${item.thumbAnnonce}`
                        newImages.push(dataImages)
                    });

                    data["annonces"]["images"] = newImages

                    newAnnonce.push(data)
                    note = 0
                })

                if (page < 0 || page === 0) {
                    results["error"] = true
                    results["messageError"] = "invalid page number, should start with 1"
                    results["message"] = []
                    res.json(results)
                } else if (page > totalPage) {
                    results["error"] = true
                    results["messageError"] = `invalid page number, last page is ${totalPage}`
                    results["message"] = []
                    res.json(results)
                } else {
                    results["error"] = false
                    results["currentPage"] = page
                    results["limit"] = limit
                    results["totalItem"] = total
                    results["totalPage"] = totalPage

                    results["message"] = newAnnonce.sort((a, b) => {
                        return b.noteMoyenGuide - a.noteMoyenGuide
                    })
                    // console.log(newAnnonce)
                    // results["message"] = newAnnonce
                    res.json(results)
                }

                // res.json()
            })
            .catch(e => {
                return res.json(e)
            })
    } catch (error) {
        return res.json(error)
    }

    //---------------------------------------------------

    // const page = parseInt(req.query.page),
    //     limit = parseInt(req.query.limit),
    //     skipIndex = (page - 1) * limit,
    //     results = {}

    // try {
    //     let total = await Annonce.countDocuments({ 'etatSuppr': false, 'etatReaparaitre': false, 'lieu': { $regex: req.query.search ? req.query.search : '' } }),
    //         totalPage = Math.ceil(total / limit)
    //     Annonce.find({ 'etatSuppr': false, 'etatReaparaitre': false, 'lieu': { $regex: req.query.search ? req.query.search : '' } })
    //         .limit(limit)
    //         .skip(skipIndex)
    //         .then(annonces => {
    //             let newAnnonce = []

    //             annonces.forEach(annonce => {
    //                 let data = {}, dataImages = {}, newImages = []
    //                 data["id"] = annonce._id
    //                 data["titre"] = annonce.titre
    //                 data["description"] = annonce.description
    //                 data["lieu"] = annonce.lieu
    //                 data["localisationAnnonce"] = annonce.localisationAnnonce

    //                 annonce.images.forEach(item => {
    //                     dataImages["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${item.photoAnnonce}`
    //                     dataImages["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${item.thumbAnnonce}`
    //                     newImages.push(dataImages)
    //                 })
    //                 data["images"] = newImages

    //                 newAnnonce.push(data);
    //             });

    //             if (page < 0 || page === 0) {
    //                 results["error"] = true
    //                 results["messageError"] = "invalid page number, should start with 1"
    //                 results["message"] = []
    //                 res.json(results)
    //             } else if (page > totalPage) {
    //                 results["error"] = true
    //                 results["messageError"] = `invalid page number, last page is ${totalPage}`
    //                 results["message"] = []
    //                 res.json(results)
    //             } else {
    //                 results["error"] = false
    //                 results["currentPage"] = page
    //                 results["limit"] = limit
    //                 results["totalItem"] = total
    //                 results["totalPage"] = totalPage
    //                 results["message"] = newAnnonce
    //                 res.json(results)
    //             }
    //         })
    //         .catch(err => {
    //             res.status(500).send({
    //                 message: err.message || "Une erreur s'est produit lors de la récuperation des annonces"
    //             })
    //         })
    // } catch (err) {
    //     console.log("totalDocument", err)
    // }
}

// find single annonce with annonceId
export const findOneAnnonce = (req, res) => {
    Annonce.findById(req.params.annonceId)
        .then(annonce => {
            if (!annonce) {
                return res.status(404).send({
                    message: "Annonce not found"
                })
            }
            res.json(annonce)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    messageError: "Annonce not found with id",
                    message: ""
                })
            }
        })
}

// search annonce by lieu
// export const searchByLieu = (req, res) => {
//     Annonce.find({ lieu: { $regex: req.params.search } })
//         .then(annonces => {
//             res.json(annonces)
//         })
//         .catch(err => {
//             return res.status(404).send({
//                 message: err
//             })
//         })
// }

// update annonce by id
export const updateAnnonce = (req, res) => {
    Annonce.findByIdAndUpdate(req.params.annonceId, req.body, { new: true })
        .then(annonce => {
            res.json(annonce)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
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
export const softDeleteAnnonce = (req, res) => {
    Annonce.findByIdAndUpdate(req.params.annonceId, {
        etatSuppr: true
    }, { new: true })
        .then(annonce => {
            res.json(annonce)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
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
    }, { new: true })
        .then(annonce => {
            res.json(annonce)
        })
        .catch(err => {
            if (err.kind === "ObjectId") {
                return res.status(404).send({
                    message: "Annonce not found with id " + req.params.annonceId
                })
            }
            return res.status(500).send({
                message: "Error updating annonce with id " + req.params.annonceId
            })
        })
}

// trouvé les annonces poster par un guide
export const findAnnonceByGuideId = async (req, res) => {
    const page = parseInt(req.query.page),
        limit = parseInt(req.query.limit),
        skipIndex = (page - 1) * limit,
        results = {}

    try {
        let total = await Annonce.aggregate([
            {
                $lookup:
                {
                    "from": "opinionannonces",
                    "as": "commentaire_annonce",
                    "let": { "annonce": "$_id" },
                    "pipeline": [
                        {
                            $match: { $expr: { $eq: ["$annonceId", '$$annonce'] } }
                        },
                        {
                            $lookup: {
                                "from": "utilisateurs",
                                "localField": "auteurId",
                                "foreignField": "_id",
                                "as": "user"
                            }
                        },
                        {
                            $unwind: "$user"
                        }
                    ]
                },
            },
        ])

        total = total.length
        let totalPage = Math.ceil(total / limit)

        Annonce.aggregate([
            {
                $lookup:
                {
                    "from": "opinionannonces",
                    "as": "commentaire_annonce",
                    "let": { "annonce": "$_id" },
                    "pipeline": [
                        {
                            $match: { $expr: { $eq: ["$annonceId", '$$annonce'] } }
                        },
                        {
                            $lookup: {
                                "from": "utilisateurs",
                                "localField": "auteurId",
                                "foreignField": "_id",
                                "as": "user"
                            }
                        },
                        {
                            $unwind: "$user"
                        }
                    ]
                },
            },
            {
                $skip: skipIndex
            }, {
                $limit: limit
            }, {
                $sort: { _id: -1 }
            },
        ]).then(annonces => {
            // res.json(annonces)
            let noteAnnonce = 0
            let newAnnonce = []

            annonces.forEach(annonce => {
                let data = {
                    annonces: {},
                }

                let dataImages = {}, newImages = [], countComment = 0

                countComment = annonce.commentaire_annonce.length
                
                annonce.commentaire_annonce.forEach(comment => {
                    noteAnnonce += comment.note 
                }) 

                data["noteMoyenAnnonce"] = noteAnnonce / countComment || 0

                data["annonces"]["_id"] = annonce._id
                data["annonces"]["titre"] = annonce.titre
                data["annonces"]["description"] = annonce.description
                data["annonces"]["lieu"] = annonce.lieu
                data["annonces"]["localisationAnnonce"] = annonce.localisationAnnonce

                annonce.images.forEach(item => {
                    dataImages["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${item.photoAnnonce}`
                    dataImages["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${item.thumbAnnonce}`
                    newImages.push(dataImages)
                });

                data["annonces"]["images"] = newImages
                data["annonces"]["commentaires"] = annonce.commentaire_annonce

                newAnnonce.push(data)
                noteAnnonce = 0
            })

            if (page < 0 || page === 0) {
                results["error"] = true
                results["messageError"] = "invalid page number, should start with 1"
                results["message"] = []
                res.json(results)
            } else if (page > totalPage) {
                results["error"] = true
                results["messageError"] = `invalid page number, last page is ${totalPage}`
                results["message"] = []
                res.json(results)
            } else {
                results["error"] = false
                results["currentPage"] = page
                results["limit"] = limit
                results["totalItem"] = total
                results["totalPage"] = totalPage
                results["message"] = newAnnonce
                res.json(results)
            }
        })
        .catch(e => {
            return res.json(e)
        })

    } catch (error) {
        return res.json({ messageError: error })
    }
    // Annonce.find({ utilisateurId: req.params.userId })
    //     .then(annonces => {
    //         res.json(annonces)
    //     })
    //     .catch(err => {
    //         res.send(err)
    //     })
}