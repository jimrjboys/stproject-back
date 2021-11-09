import mongoose from 'mongoose'
import { AnnonceSchema } from '../models/Annonce'
import { UtilisateurSchema } from '../models/Utilisateur';
import sharp from 'sharp'
// import "regenerator-runtime/runtime";
import { isPointWithinRadius } from 'geolib';

const ObjectId = mongoose.Types.ObjectId
const Annonce = mongoose.model('Annonce', AnnonceSchema)
const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema)

// create and save annonce
export const createAnnonce = async (req, res, files) => {
    // console.log(files)
    let AnnonceCreate = new Annonce(req.body)
    // let arrayImages = []
    try {
        // await Promise.all(
        //     // files.map(async file => {
        //     //     try {
        //     //         let makeThumb = await sharp(`./upload/${req.params.userId}/annonce/${file.filename}`).resize(200, 300).jpeg({ quality: 80 }).toFile(`./upload/${req.params.userId}/annonce/thumbnail/${file.filename}_thumb.jpg`)
        //     //         let objectImages = {}
        //     //         if (makeThumb) {
        //     //             objectImages["photoAnnonce"] = `upload/${req.params.userId}/annonce/${file.filename}`
        //     //             objectImages["thumbAnnonce"] = `upload/${req.params.userId}/annonce/thumbnail/${file.filename}_thumb.jpg`
        //     //             arrayImages.push(objectImages)
        //     //             AnnonceCreate.images = arrayImages
        //     //         }

        //     //     } catch (err) {
        //     //         console.log("error sharp", err)
        //     //     }
        //     // })

        // )
        let makeThumb = await sharp(`./upload/${req.params.userId}/annonce/${files.filename}`).resize(800, 720).jpeg({ quality: 72 }).toFile(`./upload/${req.params.userId}/annonce/thumbnail/${files.filename}_thumb.jpg`)
        if (makeThumb) {
            AnnonceCreate.photoAnnonce = `upload/${req.params.userId}/annonce/${files.filename}`
            AnnonceCreate.thumbAnnonce = `upload/${req.params.userId}/annonce/thumbnail/${files.filename}_thumb.jpg`
        }
    } catch (error) {
        // console.log(error)
        return res.json(error)
    }
    AnnonceCreate.save((err, data) => {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occurred while creating the Annonce"
            });
        }
        console.log('tonga eto')
        res.json(data)
    })
};

//fonction pour pagigner un array
const paginateArray = (array, page_size, current_page) => {
    return array.slice((current_page - 1) * page_size, current_page * page_size)
}


const query = (condition) => {
    return Annonce.aggregate([
        {
            $sort: { createdAt: -1 }
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
            $match: condition
        },
        {
            $lookup: {
                from: "opinionusers",
                localField: "utilisateurId",
                foreignField: "guideId",
                as: "opinion_users"
            }
        }
    ])
}

const annonceGuidePro = (search) => {
    let conditionPro = (search) ? {
        $or: [
            { lieu: { $regex: search, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true, "user_info.type": "guide pro", },
            { titre: { $regex: search, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true, "user_info.type": "guide pro", },
            { "user_info.username": { $regex: search, $options: 'i' }, "user_info.etatSuppr": false, "etatSuppr": false, "etatReaparaitre": true, "user_info.type": "guide pro" },
        ]
    } : {
        "user_info.type": "guide pro", "etatSuppr": false, "etatReaparaitre": true, "user_info.etatSuppr": false
    }

    let promess = new Promise((resolve, reject) => {
        query(conditionPro).then(annoncesPro => {
            resolve(annoncesPro)
        }).catch(e => {
            reject(e)
        })
    }) 

    return promess
}

const annonceGuide = (search) => {
    let conditionGuide = (search) ? {
        $or: [
            { lieu: { $regex: search, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true, "user_info.type": {$nin: ["guide pro", "touriste"]}, },
            { titre: { $regex: search, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true, "user_info.type": {$nin: ["guide pro", "touriste"]}, },
            { "user_info.username": { $regex: search, $options: 'i' }, "user_info.etatSuppr": false, "etatSuppr": false, "etatReaparaitre": true, "user_info.type": {$nin: ["guide pro", "touriste"]} },
        ]
    } : {
        "user_info.type": {$nin: ["guide pro", "touriste"]}, "etatSuppr": false, "etatReaparaitre": true, "user_info.etatSuppr": false
    }

    let promess = new Promise((resolve, reject) => {
        query(conditionGuide).then(annoncesGuide => {
            resolve(annoncesGuide)
        }).catch(e => {
            reject(e)
        })
    }) 

    return promess
}

export const searchAnnonce = async (req, res) => {
    const search = req.query.search
    try {
        let pro = await annonceGuidePro(search)
        try {
            let guide = await annonceGuide(search)
            let result = pro.concat(guide)
            res.json(result)
        } catch (error) {
            return res.json({
                error: true,
                message: "guide "+error.message,
                data: []
            })
        }
    } catch (error) {
        return res.json({
            error: true,
            message: error.message,
            data: []
        })
    }
}

/**
 * retrieve and return all annonces
 * accès à la pagination http://localhost:3000/annonce?page=2&limit=1 
*/
export const findAllAnnonce = async (req, res) => {
    const page = parseInt(req.query.page),
        limit = parseInt(req.query.limit),
        skipIndex = (page - 1) * limit,
        results = {}

    const lat = req.query.lat || '', lng = req.query.lng || ''
    console.log(lat, lng)
    let nearbyLocation = []

    if (lat != "" && lng != "") {
        Annonce.aggregate([
            {
                $match: {
                    etatSuppr: false,
                    etatReaparaitre: true
            }
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
            }
        ])
            .then(annonces => {

                annonces.forEach(annonce => {
                    let data = {
                        annonces: {},
                        guide: {}
                    }, countOpinion = 0

                    countOpinion = annonce.opinion_users.length
                    annonce.opinion_users.forEach(opinion => {
                        note += opinion.note
                    })

                    data["noteMoyenGuide"] = (annonce.opinion_users.length > 3) ? note / countOpinion : 0

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
                    data["annonces"]["etatReaparaitre"] = annonce.etatReaparaitre
                    data["annonces"]["prixHeure"] = annonce.prixHeure

                    data["annonces"]["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.photoAnnonce}`
                    data["annonces"]["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.thumbAnnonce}`
                    data["annonces"]["createdAt"] = annonce.createdAt

                    let locationBD = isPointWithinRadius(
                        { latitude: annonce.latitude, longitude: annonce.longitude },
                        { latitude: lat, longitude: lng },
                        1000
                    )

                    if (locationBD) {
                        nearbyLocation.push(data)
                    }
                })

                let results = {}
                const totalPageNearest = Math.ceil(nearbyLocation.length / limit)

                if (page < 0 || page === 0) {
                    results["error"] = true
                    results["messageError"] = "invalid page number, should start with 1"
                    results["message"] = []
                    res.json(results)
                } else if (page > totalPageNearest) {
                    results["error"] = true
                    results["messageError"] = `invalid page number, last page is ${totalPageNearest}`
                    results["message"] = []
                    res.json(results)
                } else {
                    results["error"] = false
                    results["currentPage"] = page
                    results["limit"] = limit
                    results["totalItem"] = nearbyLocation.length
                    results["totalPage"] = totalPageNearest
                    // results["message"] = paginateArray(nearbyLocation, limit, page)
                    results["message"] = paginateArray(nearbyLocation.sort((a, b) => {
                        if(a.noteMoyenGuide > b.noteMoyenGuide) return -1
                    }), limit, page)
                    res.json(results)
                }
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        try {
            // const lieu = req.query.search
            // let condition = (lieu) ? { "lieu": { $regex: lieu, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true } : { "etatSuppr": false, "etatReaparaitre": true }

            const search = req.query.search
            let condition = (search) ? {
                $or: [
                    { lieu: { $regex: search, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true },
                    { titre: { $regex: search, $options: 'i' }, "etatSuppr": false, "etatReaparaitre": true },
                    { "user_info.username": { $regex: search, $options: 'i' } }
                ]
            } : { "etatSuppr": false, "etatReaparaitre": true }

            let total = await Annonce.aggregate([
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
                    $match: condition
                },
                {
                    $lookup: {
                        from: "opinionusers",
                        localField: "utilisateurId",
                        foreignField: "guideId",
                        as: "opinion_users"
                    }
                },
                { $group: { _id: null, count: { $sum: 1 } } } 
            ])
            // total = total.length
            console.log(total[0].count)
            let totalPage = Math.ceil(total[0].count / limit)

            Annonce.aggregate([
                {
                    $sort: { createdAt: -1 }
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
                    $match: condition
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
                }
            ])
                .then(annonces => {
                    let note = 0
                    let newAnnonce = []

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

                        data["noteMoyenGuide"] = (annonce.opinion_users.length > 3) ? note / countOpinion : 0

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
                        data["annonces"]["etatReaparaitre"] = annonce.etatReaparaitre
                        data["annonces"]["prixHeure"] = annonce.prixHeure*0.01

                        data["annonces"]["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.photoAnnonce}`
                        data["annonces"]["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.thumbAnnonce}`
                        data["annonces"]["createdAt"] = annonce.createdAt
                        // annonce.images.forEach(item => {
                        //     dataImages["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${item.photoAnnonce}`
                        //     dataImages["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${item.thumbAnnonce}`
                        //     newImages.push(dataImages)
                        // });

                        // data["annonces"]["images"] = newImages

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
                        results["totalItem"] = total[0].count
                        results["totalPage"] = totalPage

                        results["message"] = newAnnonce.sort((a, b) => {
                            // console.log(newAnnonce)
                            // if(a.annonces.createdAt > b.annonces.createdAt) return -1
                            if (a.noteMoyenGuide > b.noteMoyenGuide) return -1
                        })
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
    }
}

// find single annonce with annonceId
export const findOneAnnonce = (req, res) => {
    Annonce.findById(req.params.annonceId)
        .then(annonce => {
            let oneAnnonce = {}
            if (!annonce) {
                return res.status(404).send({
                    message: "Annonce not found"
                })
            }

            oneAnnonce["id"] = annonce._id
            oneAnnonce["titre"] = annonce.titre
            oneAnnonce["description"] = annonce.description
            oneAnnonce["lieu"] = annonce.lieu
            oneAnnonce["latitude"] = annonce.latitude
            oneAnnonce["longitude"] = annonce.longitude
            oneAnnonce["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.photoAnnonce}`
            oneAnnonce["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.thumbAnnonce}`
            oneAnnonce["utilisateurId"] = annonce.utilisateurId
            oneAnnonce["prixHeure"] = annonce.prixHeure*0.01
            res.json(oneAnnonce)
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

// update annonce by id
export const updateAnnonce = async (req, res, files) => {
    let arrayImages = []
    let dataAnnonce = {}
    if (files) {
        let makeThumb = await sharp(`./upload/${req.params.userId}/annonce/${files.filename}`).resize(800, 720).jpeg({ quality: 72 }).toFile(`./upload/${req.params.userId}/annonce/thumbnail/${files.filename}_thumb.jpg`)
        if (makeThumb) {
            dataAnnonce.photoAnnonce = `upload/${req.params.userId}/annonce/${files.filename}`
            dataAnnonce.thumbAnnonce = `upload/${req.params.userId}/annonce/thumbnail/${files.filename}_thumb.jpg`
        }
    }


    dataAnnonce["titre"] = req.body.titre
    dataAnnonce["description"] = req.body.description
    dataAnnonce["lieu"] = req.body.lieu
    dataAnnonce["localisationAnnonce"] = req.body.localisationAnnonce
    dataAnnonce["prixHeure"] = req.body.prixHeure
    console.log(req.body)
    Annonce.findByIdAndUpdate(req.params.annonceId, dataAnnonce, { new: true })
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
        const lieu = req.query.search
        const stateAppear = (req.query.stateAppear == 'true') ? true : (req.query.stateAppear == 'false') ? false : null
        // console.log(stateAppear)
        let condition = (lieu && stateAppear == null) ? { "lieu": { $regex: lieu, $options: 'i' }, "etatSuppr": false, 'utilisateurId': ObjectId(req.params.userId) } : (lieu && stateAppear != null) ? { "lieu": { $regex: lieu, $options: 'i' }, "etatSuppr": false, 'utilisateurId': ObjectId(req.params.userId), 'etatReaparaitre': stateAppear } : (stateAppear != null) ? { 'utilisateurId': ObjectId(req.params.userId), "etatSuppr": false, 'etatReaparaitre': stateAppear } : { 'utilisateurId': ObjectId(req.params.userId), "etatSuppr": false, }

        let total = await Annonce.aggregate([
            {
                $match: condition
            },
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
                $match: condition
            },
            {
                $sort: { _id: -1 }
            },
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
            }
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

                data["noteMoyenAnnonce"] = (countComment > 3) ? noteAnnonce / countComment : 0

                data["annonces"]["_id"] = annonce._id
                data["annonces"]["titre"] = annonce.titre
                data["annonces"]["description"] = annonce.description
                data["annonces"]["lieu"] = annonce.lieu
                data["annonces"]["localisationAnnonce"] = annonce.localisationAnnonce
                data["annonces"]["etatReaparaitre"] = annonce.etatReaparaitre
                data["annonces"]["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.photoAnnonce}`
                data["annonces"]["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${annonce.thumbAnnonce}`

                // data["annonces"]["images"] = newImages
                data["annonces"]["commentaires"] = annonce.commentaire_annonce

                newAnnonce.push(data)
                noteAnnonce = 0
            })

            if (page < 0 || page === 0) {
                results["error"] = true
                results["messageError"] = "invalid page number, should start with 1"
                results["message"] = []
                results["currentPage"] = 0
                results["totalItem"] = 0
                results["totalPage"] = 0
                res.json(results)
            } else if (page > totalPage) {
                results["error"] = true
                results["currentPage"] = 0
                results["totalItem"] = 0
                results["totalPage"] = 0
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
}