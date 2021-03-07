import app from './index'

app.listen(process.env.PORT || 3000, () =>
    console.log(`Notre serveur est en marche dans le port ${process.env.PORT || 3000}`)
);