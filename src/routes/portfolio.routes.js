import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deletePortfolio, generatePortfolio, getPortfolio, getUserPortfolios, isLinkAvailable, updatePortfolio } from "../controllers/portfolio.controllers.js";
import { memoryUpload } from '../middlewares/multer.middleware.js'
const router = Router();

router.route('/generate')
    .post(verifyJWT, memoryUpload.single('file'),  generatePortfolio)

router.route('/link-available/:link')
    .get(isLinkAvailable)
    
router.route('/all')
    .get(verifyJWT, getUserPortfolios)

router.route('/:link')
    .get(getPortfolio)

router.route('/:link')
    .delete(verifyJWT, deletePortfolio)

router.route('/:link')
    .patch(verifyJWT, updatePortfolio)
export default router