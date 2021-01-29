import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const requete = new Schema ({
    touristeId: {
        type: String,
        required: 'id touriste obligatoire'
    },
    guideId: String,
    etatRequete: Boolean,
},
{
    timestamps: true
})