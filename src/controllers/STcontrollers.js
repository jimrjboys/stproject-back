import { Mongoose } from 'mongoose'
import {test } from '../models/STmodels'

const test = Mongoose.model('Utilisateur',test)

export const montest = (req,res) => {
    console.log('Controlleur en marche')
}