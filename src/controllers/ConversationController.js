import mongoose from 'mongoose';
import { ConversationSchema } from '../models/Conversation';

const Conversation = mongoose.model('Conversation', ConversationSchema);

export const createConversation = async (req, res) => {
    const ConvCreate = Conversation(req.body);

    try {
        const saveConv = await ConvCreate.save();
        res.status(200).json(saveConv);    
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const getConvByUser = async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in:[req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error.message);
    }
}