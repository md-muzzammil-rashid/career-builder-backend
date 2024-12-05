import { HttpStatusCode } from "axios";
import AsyncHandler from "../utils/AsyncHandler.js";
// import { uploadOnCloudinary } from "../utils/Cloudinary";
import ApiResponse from "../utils/ApiResponse.js";
import { parsePDFBuffer } from "../utils/pdfParser.js";
import { generateResumeAnalysis } from "../utils/googleAi.js";

// const uploadResume = AsyncHandler(async (req, res, next)=>{
//     if(!req.file){
//         return res.status(HttpStatusCode.BadRequest)
//             .json(new ApiResponse(HttpStatusCode.BadGateway, "File not found",))
//     }

//     const upload = await uploadOnCloudinary(req.file.path);

//     // const newResume =
// })

const analyzeResume = AsyncHandler( async (req, res, next) => {
    const file = req.file
    if(!file){
        return res.status(HttpStatusCode.BadRequest)
            .json(new ApiResponse(HttpStatusCode.BadGateway, "File not found",))
    }

    const parsedResume = await parsePDFBuffer(req.file.buffer);

    if(!parsedResume){
        return res.status(HttpStatusCode.BadRequest)
            .json(new ApiResponse(HttpStatusCode.BadGateway, "Failed to parse PDF",))
    }

    const analysis = await generateResumeAnalysis(parsedResume);

    return res.status(HttpStatusCode.Ok)
        .json(new ApiResponse(HttpStatusCode.Ok, "Resume analyzed successfully", analysis))
})

export {
    analyzeResume
}