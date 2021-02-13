import multer from 'multer'

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = (namefile) => {
    // const dir = `./upload/${namefile}`;
    // try {
            
    // } catch (error) {
    //     console.log(error)
    // }
}

export default function (req, res, namefile){
    multer({
        storage: storage(namefile)
    }).single('image')
}