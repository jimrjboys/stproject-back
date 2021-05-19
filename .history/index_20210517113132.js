import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import route from './src/routes/­STroutes';
import path from 'path'
import jsonwebtoken from 'jsonwebtoken';
import cors from 'cors';
import Utilisateur from './src/models/­Utilisateur'

const app = express();

//connexion avec notre base de donnée //mongodb+srv://­jiji:jiji1234@zmz.djfzj.mongodb.ne­t/­ZmZ?retryWrites=true&­w=majority //mongodb://­127.0.0.1:27017/­StProject
// mongodb+srv://­shiroe:blackflag@cluster0.4dqw7.mongo­db.net/­myFirstDatabase?retry­Writes=true&w=majori­ty mongoose.Promise = global.Promise; mongoose.connect(`mo­ngodb://­127.0.0.1:27017/­StProject`, {
useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true,
}).then(
console.log('Notre base de donnée marche bien :) ;) ')
);

//body Parser afin de connecté express avec notre object

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet())
app.use(cors())
app.use('/­upload', express.static(path.join(__dirn­ame, 'upload')))

app.use((req , res, next) => {
if (req.headers && req.headers.authoriz­ation && req.headers.authoriz­ation.split(' ')[0] === 'JWT') {
jsonwebtoken.verify(­req.headers.authoriz­ation.split(' ')[1], 'RESTFULAPIs', (err, decode) =>{
if (err) req.Utilisateur = undefined;
req.Utilisateur = decode;
next();
});
} else {
req.Utilisateur = undefined;
next();
}
})
//declaration de notre router ici apres creation
route(app);
//notre lien initiale
app.get('/', (req, res) =>
res.send(`notre serveur a été demarer sur le port : ${process.env.PORT || 8080}`) );

export default app ;