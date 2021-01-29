import mongoose from 'mongoose' 

const Schema = mongoose.Schema ;

export const  LocalisationSchema  = new Schema ({
    timestamps : true , 
    longitude : Number , 
    latitude : Number ,
    idUtilisateur : String , 
})