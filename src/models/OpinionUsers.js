import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const OpionionUsersSchema = new Schema({
    //ato ny  schema anle basentsika 
    note: {
        type: Number,
    },
    avis: {
        type: String,
    },
    etatSuppr: {
        type: Boolean,
        default: false,
    },
    guideId: {
        type: Schema.ObjectId, 
        ref: 'utilisateurs',
        required: true
    },
    touristeId:  {
        type: Schema.ObjectId, 
        ref: 'utilisateurs',
        required: true
    }
}, { timestamps: true })