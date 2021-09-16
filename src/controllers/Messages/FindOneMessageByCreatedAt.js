import mongoose from 'mongoose';
import { MessageSchema } from '../../models/Messenger';

const Message = mongoose.model('Message', MessageSchema);

export const findOneMessageByCreatedAt = async (req, res) => {
    try {
        const oneMessage = await Message.findOne({
            createdAt: req.params.createdAt
        });

        res.status(200).json(oneMessage);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}