import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const PubliciteSchema = new Schema({
    photo: {
        type: String,
    },
    video : {
        type :  String 
    }, 
    auteurId: {
        type: Schema.ObjectId,
        ref: 'utilisateurs',
        required: 'id auteur obligatoire'
    },
    description  :{
        type : String ,
        required :  'titre de votre pub'
    },
    titre :  {
        type : String ,  
        required :  'le titre de votre pub'
    },
    link: {
        type: String
    } , 
    duree : {
        type :  number ,  
        required :  'duree'
    },
    etat : {
        type : Boolean,
        required :'etat de publication '
    },
    position : {
        type  :  String , 
        required : 'où  voulez vous mettre la pub'
    }

}, {
    timestamps: true
})