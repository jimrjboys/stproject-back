import mongoose from 'mongoose';
import { ConversationSchema } from '../models/Conversation';

const Conversation = mongoose.model('Conversation', ConversationSchema);

/**
 * Create conversation
 * @param {*} req 
 * @param {*} res 
 */
export const createConversation = async (req, res) => {
    const ConvCreate = Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {
        const saveConv = await ConvCreate.save();
        res.status(200).json(saveConv);    
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * get conversation by his ID
 * @param {*} req 
 * @param {*} res 
 */
export const getConvById = async (req, res) => {
    try{
        const conversation = await Conversation.findById({_id: req.params.idConv});
        res.status(200).json(conversation);
    }catch(error){
        res.status(500).json(error.message)
    }
}

/**
 * get all Conversations include userId in members array
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * get One conversation by receiver and sender ID
 * @param {*} req 
 * @param {*} res 
 */
export const getConvByUsersId = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: {
                $all: [req.params.firstUserId, req.params.secondUserId]
            }
        });

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error.message);
    }
}