import { MessagesShema }from './../models/Messages'
import mongoose from 'mongoose'

const Messages  = mongoose.model('Messages',MessagesShema)

export const  newMessages  = (req , res ) => {
    let nouveauxMessages = new Messages(req.body);
    nouveauxMessages.emetteurId = new Messages (req.params.emetteurId) ;
    nouveauxMessages.recepteurID = new Messages (req.params.recepteurID) ;
    nouveauxMessages.save((err, nouveauxMessages) => {
        if (err) {
            res.send(err) 
        }
        res.json(nouveauxMessages) 
    });
}
export const getMesssages = (req , res ) => {
    // Limite messages avec filtre du reponse
    Messages.findById({ _id: req.params._id }, (err, getMesssages) => {
        if (err) {
            res.send(err)
        }
        
        res.json(getMesssages)

    }).limit(10);
}
export const getMesssagesScrollUp = (req , res ) => {
    // Limite messages avec filtre du reponse
    var n
    Messages.findById({ _id: req.params._id }, (err, getMesssagesScrollUp) => {
   
        if (err) {
            res.send(err)
        }
        
        res.json(getMesssagesScrollUp)

    }).limit(n+10);
}
