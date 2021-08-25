import {
    createMessage,
    findByConId
} from '../controllers/MessageController';

const MessageRoute = (app) => {
    app.post('/message', createMessage);

    app.get('/message/:conversationId', findByConId);
};

export default MessageRoute;