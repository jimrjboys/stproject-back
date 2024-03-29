import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const publiciteSchema = new Schema({
    photo: {
        type: String,
        required: 'photo obligatoire'
    },
    auteurId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: 'id auteur obligatoire'
    }
}, {
    timestamps: true
})