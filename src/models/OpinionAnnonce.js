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
        type: String,
        required: 'id auteur obligatoire'
    },
    annonceId: {
        type: String,
        required: 'id annonce obligatoire'
    },
    etatSuppr: Boolean
},{
    timestamps: true
})