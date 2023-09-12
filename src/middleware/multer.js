import multer from "multer";
import { __dirname } from '../utils/path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const body = req.body; // Entrega body vacío
        const docName = Object.values(body)[0]
        if (docName == 'profileImg') {
            cb(null, __dirname + '/public/profile')
        }
        else if (docName == 'product') {
            cb(null, __dirname + '/public/products')
        }
        else {
            cb(null, __dirname + '/public/documents')
        }
    },
    filename: (req, file, cb) => {
        const userId = req.params.id;
        cb(null, userId + '_' + file.originalname)
    }
})
export const uploader = multer({ storage: storage })