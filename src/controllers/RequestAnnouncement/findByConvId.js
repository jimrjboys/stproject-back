import mongoose from 'mongoose';
import { requeteSchema } from '../../models/Requete';

const ObjectId = mongoose.Types.ObjectId;
const Requete = mongoose.model('Requete', requeteSchema);

export const findByConvId = async (req, res) => {
    try {
        const request = await Requete.findOne({
            conversationId: ObjectId(req.params.convId)
        });

        res.status(200).json(request);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}