import {
    createConversation,
    getConvByUser,
} from '../controllers/ConversationController';


const ConversationRoute = (app) => {
    app.post('/conversation', createConversation);

    app.get('/conversation/:userId', getConvByUser);
};

export default ConversationRoute;