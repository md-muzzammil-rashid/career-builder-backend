import {Router} from 'express'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cloudUpload } from '../middlewares/multer.middleware.js';
import { deleteAsset, getAssets, uploadAssets } from '../controllers/assets.controllers.js';

const router = Router();


router.route('/')
    .post(verifyJWT, cloudUpload.single('file'), uploadAssets)
    .get(verifyJWT, getAssets)
    
router.route('/:assetId')
    .delete(verifyJWT, deleteAsset)


export default router