import mongoose from 'mongoose';
import { MessageSchema } from '../../models/Messenger';
// import moment from 'moment';
const Message = mongoose.model('Message', MessageSchema);


export const editMessage = async (req, res) => {
    try {
        const message = await Message.findOneAndUpdate({
            _id: req.params.messageId
        }, req.body, {new: true, useFindAndModify: false});

        res.status(200).json(message);
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

export const editMessageByCreate = async (req, res) => {
  
    try {
        const message = await Message.findOneAndUpdate({
            createdAt: req.params.createdAt,
        }, req.body, {new: true, useFindAndModify: false});

        res.status(200).json(message);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}