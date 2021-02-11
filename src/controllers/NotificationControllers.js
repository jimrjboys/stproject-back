import mongoose from 'mongoose'
import { NotificationSchema } from '../models/Notification'

const Notification = mongoose.model('Notification', NotificationSchema)

export const ajoutNotification = (req, res) => {
    let nouvelleNotification = new Notification(req.body);
    nouvelleNotification.save((err, newNotification) => {
        if (err) {
            res.send(err)
        }

        res.json(newNotification)
    });
}
export const modificationNotification = (req, res) => {

    Utilisateur.findOneAndUpdate({ _id: req.params.notificationId }, req.body, { new: true }, (err, modifNotificationId) => {
        if (err) {
            res.send(err)
        }
        res.json(modifNotificationId)

    });
}