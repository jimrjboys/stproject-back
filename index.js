import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import route from './src/routes/STroutes';
const app = express();

//connexion  avec notre base de donnée
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://jiji:jiji1234@zmz.djfzj.mongodb.net/ZmZ?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,

}).then(
    console.log('Notre base de donnée marche bien :) ;) ')
);

//body Parser afin de connecté  express avec notre object

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//declaration de notre router ici apres creatoin 
route(app);
//notre lien initiale
app.get('/', (req, res) =>
    res.send(`notre serveur a été demarer sur le port : ${process.env.PORT || 3000}`)
);
// app.listen(PORT, () =>
//         console.log(`Notre serveur est en marche dans le port ${PORT}`)
// );
app.listen(process.env.PORT || 3000, () =>
    console.log(`Notre serveur est en marche dans le port ${process.env.PORT || 3000}`)
);



