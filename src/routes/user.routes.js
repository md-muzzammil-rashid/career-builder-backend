import { Router } from "express";
import { changePassword, createUser, getUserInfo, logoutUser, updateAccountDetails, uploadUserDetails, userLogin } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route('/signup')
      .post(createUser)

router.route('/signin')
      .post(userLogin)

router.route('/signout')
      .post(verifyJWT, logoutUser)

router.route('/upload-details')
      .post(verifyJWT, uploadUserDetails)

router.route('/get-user-info')
      .get(verifyJWT, getUserInfo)

router.route('/change-password')
      .post(verifyJWT, changePassword)

router.route('/update-account-details')
      .post(verifyJWT, updateAccountDetails)

export default router