import mongoose from 'mongoose'
import { AnnonceSchema } from '../models/Annonce'
import sharp from 'sharp'
import "regenerator-runtime/runtime";

const Annonce = mongoose.model('Annonce', AnnonceSchema)

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
            res.status(500).send({
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
        let total = await Annonce.countDocuments({ lieu: { $regex: req.query.search ? req.query.search : '' } }),
            totalPage = Math.ceil(total / limit)
        Annonce.find({ lieu: { $regex: req.query.search ? req.query.search : '' } })
            .limit(limit)
            .skip(skipIndex)
            .then(annonces => {
                let newAnnonce = []
                
                annonces.forEach(annonce => {
                    let data = {}, dataImages = {}, newImages = []

                    data["titre"] = annonce.titre
                    data["description"] = annonce.description
                    data["lieu"] = annonce.lieu
                    data["localisationAnnonce"] = annonce.localisationAnnonce
                    
                    annonce.images.forEach(item => {
                        dataImages["photoAnnonce"] = `${req.protocol}://${req.get('host')}/${item.photoAnnonce}`
                        dataImages["thumbAnnonce"] = `${req.protocol}://${req.get('host')}/${item.thumbAnnonce}`
                        newImages.push(dataImages)
                    })
                    data["images"] = newImages

                    newAnnonce.push(data);
                });
                // res.json(newAnnonce);
                if(page < 0 || page === 0){
                    results["error"] = true
                    results["message"] = "invalid page number, should start with 1"
                    res.json(results)
                }else if(page > totalPage){
                    results["error"] = true
                    results["message"] = `invalid page number, last page is ${totalPage}`
                    res.json(results)
                }else{
                    results["error"] = false
                    results["currentPage"] = page
                    results["limit"] = limit
                    results["totalItem"] = total
                    results["totalPage"] = totalPage
                    results["message"] = newAnnonce
                    res.json(results)
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Une erreur s'est produit lors de la récuperation des annonces"
                })
            })
    } catch (err) {
        console.log("totalDocument", err)
    }
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
                    message: "Annonce not found with id"
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
        etatSuppr: req.body.etatSuppr
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
export const findAnnonceByGuideId = (req, res) => {
    Annonce.find({ utilisateurId: req.params.userId })
        .then(annonces => {
            res.json(annonces)
        })
        .catch(err => {
            res.send(err)
        })
}
