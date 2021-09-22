import {
    findByTouristAnnouncement
} from '../controllers/RequestAnnouncement/findByTouristAnnouncement';

import {
    editRequest
} from '../controllers/RequestAnnouncement/editRequest';

import {
    findByConvId
} from '../controllers/RequestAnnouncement/findByConvId';

export const RequestRoute = (app) => {
    app.get('/request/findByTouristAnnouncement/:annonceId/:touristId/:guideId', findByTouristAnnouncement);

    app.put('/request/edit/:requestId', editRequest);

    app.get('/request/findByConv/:convId', findByConvId);
}