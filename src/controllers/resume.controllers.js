import { HttpStatusCode } from "axios";
import AsyncHandler from "../utils/AsyncHandler.js";
import {v4 as uuid} from 'uuid'
import ApiResponse from "../utils/ApiResponse.js";
import { parsePDFBuffer } from "../utils/pdfParser.js";
import { generateResumeAnalysis, generateResumeWithAI } from "../utils/googleAi.js";
import { UserModel } from "../models/user.model.js";

const createResumeWithAI = AsyncHandler(async (req, res, next) => {
    const {title} = req.body;
    const userData = await UserModel.findById(req.user._id).select('-password -savedResume -refreshToken -resumeDetails -username -updatedAt -createdAt').lean()
    const AIGeneratedResume = await generateResumeWithAI(JSON.stringify(userData));

    const updateUserData = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $push: { savedResume: { ...AIGeneratedResume, 
            generatedWithAi: true, 
            resumeId: uuid().toString(),
            createdAt: new Date().toISOString(),
            title: title
        } } },
        { new: true }
    );

    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Resume created successfully", AIGeneratedResume))
})

const createResume = AsyncHandler(async (req, res, next) => {
    const {title} = req.body
    const userData = await UserModel.findById(req.user._id).select('-password -savedResume -refreshToken -resumeDetails -username -updatedAt -createdAt').lean()
    const newResume = {generatedWithAi : false};
    newResume.profileInfo = userData.profileInfo
    newResume.experience = userData.experience
    newResume.educations = userData.educations
    newResume.skills = userData.skills
    newResume.projects = userData.projects
    newResume.achievements = userData.achievements
    newResume.certifications = userData.certifications
    newResume.resumeId = uuid().toString()
    newResume.createdAt = new Date().toISOString()
    newResume.title = title
    const updateUserData = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $push: { savedResume: newResume } },
        { new: true }
    );

    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Resume created successfully", newResume))
})

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

const getResumeById = AsyncHandler(async(req, res, next)=> {
    const {resumeId} = req.params
    const resume = await UserModel.findOne(
        { _id: req.user._id, "savedResume.resumeId": resumeId },
        { "savedResume.$": 1 } 
      )
      .lean();
    if(!resume){
        return res.status(HttpStatusCode.NotFound)
       .json(new ApiResponse(HttpStatusCode.NotFound, "Resume not found"))
    }
    return res.status(HttpStatusCode.Ok)
     .json(new ApiResponse(HttpStatusCode.Ok, "Resume found", resume.savedResume[0]))
})

const getUserResumes = AsyncHandler( async (req, res, next)=>{
    const resumes = await UserModel.findById(req.user._id).lean()
    const userResumes = resumes?.savedResume?.map(resume => (
        {resumeId:resume.resumeId, createdAt:resume.createdAt, generatedWithAi: resume.generatedWithAi, title:resume.title}
    ))
    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Resumes found", userResumes))
})
export {
    analyzeResume,
    createResumeWithAI,
    createResume,
    getResumeById,
    getUserResumes
}