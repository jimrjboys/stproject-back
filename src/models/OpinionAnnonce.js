import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const opinionAnnonceSchema = new Schema({
    note: {
        type: Number,
        required: 'note obligatoire'
    },
    avis: {
        type: String,
        required: 'avis commentaire obligatoire'
    },
    auteurId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: 'id auteur obligatoire'
    },
    annonceId: {
        type: Schema.ObjectId,
        ref: 'annonces',
        required: 'id annonce obligatoire'
    },
    etatSuppr: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})