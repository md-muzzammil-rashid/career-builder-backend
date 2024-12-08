import { HttpStatusCode } from "axios";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import assetsModel from "../models/assets.model.js";

const getAssets = AsyncHandler(async (req, res) => {
    const assets = await assetsModel.find({user: req.user._id}).lean()
    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Assets fetched successfully", assets))
})

const uploadAssets = AsyncHandler(async (req, res) => {
    const file = req.file
    if(!file || !file.path){
        return res.status(400)
           .json(new ApiResponse(HttpStatusCode.BadRequest, "File not found"))
    }
    const uploadedFile = await uploadOnCloudinary(file.path);
    const newAsset = await assetsModel.create({
        user: req.user._id,
        url: uploadedFile.secure_url,
        title: req.body.title,
        filename: file.originalname,
        extension: file.originalname.split('.').pop(),
        type: file.mimetype
    })

    return res.status(HttpStatusCode.Created)
        .json( new ApiResponse(HttpStatusCode.Created, "File uploaded successfully", newAsset))
})

const deleteAsset = AsyncHandler(async (req, res) => {
    const { assetId } = req.params
    const asset = await assetsModel.findById(assetId);
    if(!asset){
        return res.status(HttpStatusCode.BadRequest)
           .json(new ApiResponse(HttpStatusCode.BadRequest, "Invalid asset ID"))
    }
    
    if(asset.user.toString() !== req.user._id.toString()){
        return res.status(HttpStatusCode.Unauthorized)
           .json(new ApiResponse(HttpStatusCode.Unauthorized, "Unauthorized to delete this asset"))
    }
    const deletedAsset = await assetsModel.findByIdAndDelete(assetId);
    if(!deletedAsset){
        return res.status(HttpStatusCode.InternalServerError)
           .json(new ApiResponse(HttpStatusCode.InternalServerError, "Failed to delete asset"))
    }
    return res.status(HttpStatusCode.NoContent)
        .json(new ApiResponse(HttpStatusCode.Ok, "File Deleted"))
})

export {
    uploadAssets,
    getAssets,
    deleteAsset
}