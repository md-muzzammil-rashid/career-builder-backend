import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME
})

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        console.log("cloudinary");
        if(!localFilePath)return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "image"
        })
        console.log(response);
        
            fs.unlinkSync(localFilePath);
            console.log("File uploaded successful");

        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log("Failed to upload");
        return null;
    }
}
export {
    uploadOnCloudinary
}