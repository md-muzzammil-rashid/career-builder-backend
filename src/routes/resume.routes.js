import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cloudUpload, memoryUpload } from "../middlewares/multer.middleware.js";
import { analyzeResume, createResumeWithAI, createResume, getResumeById , getUserResumes} from '../controllers/resume.controllers.js'

const router = Router();

router.route('/')
    .get(verifyJWT, getUserResumes)

// router.route('/resume-data')
//     .patch

router.route('/analyze')
    .post(verifyJWT, memoryUpload.single('file'), analyzeResume)

router.route('/generate-with-ai')
    .post(verifyJWT, createResumeWithAI)

router.route('/generate')
    .post(verifyJWT, createResume)

router.route('/:resumeId')
    .get(verifyJWT, getResumeById)

export default router;