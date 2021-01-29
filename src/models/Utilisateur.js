import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UtilisateurSchema = new Schema ({
    
    nom : {
        type:String ,
        required : 'Vous avez oublier de mettre votre nom',
    },
    prenom  : {
        type:String , 

    }, 
    tel : {
        type: String , 
         required : 'Veuillez entrer un numero telephone'
    },
    email : {
        type : String ,
        required : 'Veullez entrer votre email',
    },
    username : {
        type: String ,
        required : 'Veullez entrer un nom  utilisateur ' ,
    },
    password : {
        type : String ,
        required : 'Veuillez entre votre mot de passe'
    },
    type : {
        type : String ,

    },
    localisation : {
        type : String ,
    },
    etatConnexion : {
        type : Boolean , 
    },
    etatSuppr : {
        type : Boolean,
    },
    pdp : {
        type : String , 
    },




})