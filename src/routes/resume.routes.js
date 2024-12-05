import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { cloudUpload } from "../middlewares/multer.middleware";

const router = Router();

router.route('/')
    .post(verifyJWT, cloudUpload.single('file') , uploadResume)

export default router;