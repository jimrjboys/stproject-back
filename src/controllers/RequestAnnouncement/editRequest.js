import mongoose from 'mongoose';
import { requeteSchema } from '../../models/Requete';

const Requete = mongoose.model('Requete', requeteSchema)

export const editRequest = async (req, res) => {
    try {
        const request = await Requete.findOneAndUpdate({
            _id: req.params.requestId
        }, req.body, {new: true, useFindAndModify: false});

        res.status(200).json(request);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}