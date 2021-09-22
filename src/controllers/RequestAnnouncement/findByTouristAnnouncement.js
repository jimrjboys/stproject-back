import mongoose from 'mongoose';
import { requeteSchema } from '../../models/Requete';

const ObjectId = mongoose.Types.ObjectId;
const Requete = mongoose.model('Requete', requeteSchema)


export const findByTouristAnnouncement = async (req, res) => {
    try {
        const request = await Requete.findOne({
            "annonceId": ObjectId(req.params.annonceId),
            "touristeId": ObjectId(req.params.touristId),
            "guideId": ObjectId(req.params.guideId),
            // "etatRequete": 0
        });   

        res.status(200).json(request);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}