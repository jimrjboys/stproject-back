import mongoose from 'mongoose';
import { MessageSchema } from '../../models/Messenger';

const Message = mongoose.model('Message', MessageSchema);

export const findOneMessage = async (req, res) => {
    try {
        const oneMessage = await Message.findOne({
            _id: req.params.messageId
        });

        res.status(200).json(oneMessage);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}