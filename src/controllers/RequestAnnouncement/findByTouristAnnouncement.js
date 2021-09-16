import mongoose from 'mongoose';
import { requeteSchema } from '../../models/Requete';

const Requete = mongoose.model('Requete', requeteSchema)


export const findByTouristAnnouncement = async (req, res) => {
    try {
        const request = await Requete.findOne({
            "annonceId": req.params.annonceId,
            "touristeId": req.params.touristId,
            "guideId": req.params.guideId,
            "etatRequete": 0
        });   

        res.status(200).json(request);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}