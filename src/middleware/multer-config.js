import multer from 'multer'

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = (namefile) => {
    const dir = `./upload/${namefile}`;
    
    // const dir = `./upload/${req.params.userId}/annonce`;

    multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, dir)
        },
        filename: (req, file, callback) => {
            const name = file.originalname.split(' ').join('_')
            const extension = MIME_TYPES[file.mimetype]
            callback(null, name + Date.now() + '.' + extension)
        }
    })
}

export const media = (namefile) => {
    return multer({
        storage: storage(namefile)
    }).any()

    // next()
}