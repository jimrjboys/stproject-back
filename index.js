import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import route from './src/routes/STroutes';
import routesData from './src/routes/routes';
import stripeRoute from './src/routes/stripe';
import messageRoute from './src/routes/message';
import conversationRoute from './src/routes/conversation';
import path from 'path';
import jsonwebtoken from 'jsonwebtoken';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import socket from './socket/Socket';
// import Utilisateur from './src/models/Utilisateur'

dotenv.config();

const app = express();


//connexion  avec notre base de donnée
//mongodb+srv://nasaharilala:<password>@speedtourismcluster.ruuni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//mongodb+srv://jiji:jiji1234@zmz.djfzj.mongodb.net/ZmZ?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/StProject
// mongodb+srv://shiroe:blackflag@cluster0.4dqw7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// mongodb://root:root@195.15.229.222:27017/StProject?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false
// mongodb://root:root@195.15.229.222:27017/StProject?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://nasaharilala:03poivrons@speedtourismcluster.ruuni.mongodb.net/stbase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,

}).then(
    console.log('Notre base de donnée marche bien :) ;) ')
);

//body Parser afin de connecté  express avec notre object

// let corsOptions = {
//   origin: "http://localhost:3000/"
// } 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet())
app.use(cors())

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  }
})

socket(io);

app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use((req , res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) =>{
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
routesData(app);
// route pour stripe
stripeRoute(app);
messageRoute(app);
conversationRoute(app);

//notre lien initiale
app.get('/', (req, res) =>
    res.send(`notre serveur a été demarer sur le port : ${process.env.PORT || 8080}`)
);

export default httpServer ; 
