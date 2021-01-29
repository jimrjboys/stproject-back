import mongoose from 'mongoose' 

const Schema = mongoose.Schema ;

export const  LocalisationSchema  = new Schema ({
 
    longitude : Number , 
    latitude : Number ,
    idUtilisateur : String , 
    
},{timestamps : true , })