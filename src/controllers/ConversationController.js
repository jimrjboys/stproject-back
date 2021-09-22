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
        annonceId: req.body.annonceId,
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
        // const conversation = await Conversation.find({
        //     members: { $in:[req.params.userId] },
        // });

        const conversation = await Conversation.aggregate([
            {
                $match: {
                    members: {
                        $in: [req.params.userId]
                    },
                }
            },
            {
                $lookup: {
                    "from": "annonces",
                    "localField": "annonceId",
                    "foreignField": "_id",
                    "as": "annonce_info",
                },
            },
            {
                $unwind: "$annonce_info"
            },
            {
                $lookup: {
                    "from": "utilisateurs",
                    "localField": "annonce_info.utilisateurId",
                    "foreignField": "_id",
                    "as": "guide_info",
                }
            },
            {
                $unwind: "$guide_info"
            }
        ]);

        conversation.forEach(item => {
            item.annonce_info.photoAnnonce = `${req.protocol}://${req.get('host')}/${item.annonce_info.photoAnnonce}`;
            item.annonce_info.thumbAnnonce = `${req.protocol}://${req.get('host')}/${item.annonce_info.thumbAnnonce}`;
            item.guide_info.pdp = `${req.protocol}://${req.get('host')}/${item.guide_info.pdp}`;
            item.guide_info.thumbPdp = `${req.protocol}://${req.get('host')}/${item.guide_info.thumbPdp}`;
        });

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * get One conversation by receiver and sender ID  with annonceId
 * @param {*} req 
 * @param {*} res 
 */
export const getConvByUsersId = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: {
                $all: [req.params.firstUserId, req.params.secondUserId]
            },
            annonceId: req.params.annonceId,
        });

        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error.message);
    }
}