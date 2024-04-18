import { UserModel } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'


const verifyJWT = AsyncHandler( async (req, res, next)=>{
    const AccessToken = await req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ","")
    const userToken = jwt.verify(AccessToken, process.env.ACCESS_TOKEN_SECRET)
    if(!userToken){
        throw new ApiError(404, "Cookie not found")
    }
    const user = await UserModel.findById(userToken._id)
    if(!user){
        throw new ApiError(401, "Invalid Token")
    }
    req.user = user
    next();

})

export {
    verifyJWT
}