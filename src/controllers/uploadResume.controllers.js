import { HttpStatusCode } from "axios";
import AsyncHandler from "../utils/AsyncHandler";
import { uploadOnCloudinary } from "../utils/Cloudinary";
import ApiResponse from "../utils/ApiResponse";

const uploadResume = AsyncHandler(async (req, res, next)=>{
    if(!req.file){
        return res.status(HttpStatusCode.BadRequest)
            .json(new ApiResponse(HttpStatusCode.BadGateway, "File not found",))
    }

    const upload = await uploadOnCloudinary(req.file.path);

    const newResume =
})