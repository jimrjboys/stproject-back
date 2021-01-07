import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const test = new Schema ({
 //ato ny  schema anle basentsika 
    number : {
        type : Number ,
        required:'Ilaina ity ooo'
    }

})