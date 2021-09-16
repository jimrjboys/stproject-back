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

export const findLastOneMessage = async (req, res) => {
    try {
        const lastMessage = await Message.findOne({
            conversationId: req.params.convId
        }).sort({
            createdAt: -1
        }).limit(1);

        res.status(200).json(lastMessage);
    } catch (error) {
        res.status(500).json(error.message);
    }
}