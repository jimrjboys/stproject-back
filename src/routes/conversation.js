import {
    createConversation,
    getConvById,
    getConvByUser,
    getConvByUsersId,
} from '../controllers/ConversationController';


const ConversationRoute = (app) => {
    app.post('/conversation', createConversation);

    app.get('/conversation/id/:idConv', getConvById);

    app.get('/conversation/:userId', getConvByUser);

    app.get('/conversation/:firstUserId/:secondUserId/:annonceId', getConvByUsersId);
};

export default ConversationRoute;