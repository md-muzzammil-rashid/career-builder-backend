import multer from 'multer'
import {v4 as uuid} from 'uuid'
import path from 'path'
const diskStorage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'./public/temp/')
    },
    filename:(req, file, cb)=>{
        cb(null,uuid()+file.originalname+path.extname(file.originalname))
    }
})

export const memoryUpload = multer({storage:multer.memoryStorage()})

export const cloudUpload = multer({storage:multer.diskStorage(diskStorage)})