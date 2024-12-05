import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cloudUpload, memoryUpload } from "../middlewares/multer.middleware.js";
import { analyzeResume } from '../controllers/resume.controllers.js'

const router = Router();

// router.route('/')
//     .post(verifyJWT, cloudUpload.single('file') , uploadResume)

// router.route('/resume-data')
//     .patch

router.route('/analyze')
    .post(verifyJWT, memoryUpload.single('file'), analyzeResume)

export default router;