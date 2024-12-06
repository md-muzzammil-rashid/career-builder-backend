import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changeUrl, deletePortfolio, generatePortfolio, getAuthorizedPortfolio, getPortfolio, getUserPortfolios, isLinkAvailable, updatePortfolio, sendMail } from "../controllers/portfolio.controllers.js";
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
    .put(verifyJWT, updatePortfolio)

router.route('/get-authorized-portfolio/:link')
    .get(verifyJWT, getAuthorizedPortfolio)

router.route('/change-url')
    .patch(verifyJWT, changeUrl)

router.route('/send-mail/:link')
    .post(sendMail)
export default router