import mongoose from 'mongoose';
import { MessageSchema } from '../models/Messenger';

const Message = mongoose.model('Message', MessageSchema);

export const createMessage = async (req, res) => {
    const MessageCreate = new Message(req.body);

    try {
        const saveMessage = await MessageCreate.save();
        res.status(200).json(saveMessage); 
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const findByConId = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error.message);
    }
}