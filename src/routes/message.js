import {
    createMessage,
    findByConId,
    findLastOneMessage
} from '../controllers/MessageController';

import {
    editMessage,
    editMessageByCreate
} from '../controllers/Messages/EditMessages';

import {
    findOneMessage
} from '../controllers/Messages/FindOneMessage';

import {
    findOneMessageByCreatedAt
} from '../controllers/Messages/FindOneMessageByCreatedAt';

const MessageRoute = (app) => {
    app.post('/message', createMessage);

    app.get('/message/:conversationId', findByConId);

    app.get('/message/latestOne/:convId', findLastOneMessage);

    app.get('/message/findOne/:messageId', findOneMessage);

    app.get('/message/findByCreated/:createdAt', findOneMessageByCreatedAt);

    app.put('/message/edit/:messageId', editMessage);

    app.put('/message/editByCreated/:createdAt', editMessageByCreate);
};

export default MessageRoute;