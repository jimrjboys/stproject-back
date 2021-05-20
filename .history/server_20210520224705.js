import http from './index'
import fs from "fs"

var server  = http.listen(process.env.PORT || 8080, () =>{
    const dir = './upload'
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true }, err => console.log(err))
    }
    // console.log(`Notre serveur est en marche dans le port ${process.env.PORT || 3000}`)
    console.log(`Notre serveur est en marche dans le port ${process.env.PORT || 8080 || server.address().port}`)
});