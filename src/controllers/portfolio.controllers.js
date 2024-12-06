import { HttpStatusCode } from "axios";
import portfolioModel from "../models/portfolio.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {  generatePortfolioContentWithUserDataAndResume } from '../utils/openAi.js'
import { parsePDFBuffer, parsePDFLink } from '../utils/pdfParser.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { generatePortfolioContentWithResume } from '../utils/googleAi.js'

const generatePortfolio = AsyncHandler(async (req, res, next)=> {
    const {url, useProfileData} = req.body; 
    if(!url){
        return res.status(HttpStatusCode.BadRequest)
           .json(new ApiResponse(HttpStatusCode.BadRequest, "No URL Provided"))
    }
    const normalizedLink = url.toLowerCase();
    const isUrlNotPresent = await portfolioModel.findOne({link: normalizedLink});
    if(isUrlNotPresent) {
        return res.status(HttpStatusCode.Ok)
           .json(new ApiResponse(HttpStatusCode.Ok, "Url Already Occupied"))
    }
    if(!req.file){
        return res.status(HttpStatusCode.BadRequest)
           .json(new ApiResponse(HttpStatusCode.BadRequest, "No File Provided"))
    }
    // const upload = await uploadOnCloudinary(req.file.path)
    const parsedResume = await parsePDFBuffer(req.file.buffer);
    let profileData = null;
    if(useProfileData){
        profileData = await portfolioModel.findById(req.user._id).lean();
    }
    let portfolioData = null;
    if(profileData){
        portfolioData = await generatePortfolioContentWithUserDataAndResume(parsedResume, profileData)
    }else{
        portfolioData = await generatePortfolioContentWithResume(parsedResume)
    }

    const newPortfolio = await portfolioModel.create({
        ...portfolioData,
        link: normalizedLink,
        user: req.user._id,
    })

    return res.status(HttpStatusCode.Created)
        .json(
            new ApiResponse(HttpStatusCode.Created, "Portfolio Created", newPortfolio)
        )

})

const isLinkAvailable = AsyncHandler(async (req, res, next)=> {
    const {link} = req.params;
    const normalizedLink = link.toLowerCase();
    const isAvailable = await portfolioModel.findOne({link: normalizedLink})
    if(isAvailable){
        return res.status(HttpStatusCode.Accepted)
            .json(new ApiResponse(HttpStatusCode.Conflict, "Link Already Taken", {success:false} ))
    }
    return res.status(HttpStatusCode.Accepted)
        .json(new ApiResponse(HttpStatusCode.Ok, "Link Available", {success:true} ))
    
})

const getPortfolio = AsyncHandler(async (req, res, next) => {
    const {link} = req.params;
    const normalizedLink = link.toLowerCase();
    const portfolio = await portfolioModel.findOne({link: normalizedLink}).select('-user')

    if(!portfolio){
        return res.status(HttpStatusCode.NotFound)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }
    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Portfolio Found", portfolio))
})

const deletePortfolio = AsyncHandler(async (req, res, next) => {
    const {link} = req.params;
    const normalizedLink = link.toLowerCase();
    const portfolio = await portfolioModel.findOne({link: normalizedLink})
    if(!portfolio) {
        return res.status(HttpStatusCode.NotFound)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }
    if(portfolio.user.toString() !== req.user._id.toString()){
        return res.status(HttpStatusCode.Unauthorized)
        .json(new ApiResponse(HttpStatusCode.Unauthorized, "Unauthorized to Delete This Portfolio"))
    }
    if(!portfolio){
        return res.status(HttpStatusCode.NotFound)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }
    return res.status(HttpStatusCode.NoContent)
       .json(new ApiResponse(HttpStatusCode.NoContent, "Portfolio Deleted"))
})

const getUserPortfolios = AsyncHandler(async (req, res, next)=> {
    const portfolios = await portfolioModel.find({user: req.user._id})
    .select('-user')
    .lean()
    const url = portfolios.map(portfolio => portfolio.link)
    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Portfolios Found", url))
})

const updatePortfolio = AsyncHandler(async (req, res, next) => {
    const {link} = req.params;
    const normalizedLink = link.toLowerCase();

    const dataToUpdate= Object.fromEntries(
        Object.entries(req.body).filter(([key]) => !['_id', 'link'].includes(key))
      );
    const portfolio = await portfolioModel.findOneAndUpdate({link: normalizedLink, user: req.user._id}, dataToUpdate, {new: true}).select('-user');
    if(!portfolio) {
        return res.status(HttpStatusCode.NotFound)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }
    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Portfolio Updated", portfolio))
})
export {
    generatePortfolio,
    isLinkAvailable,
    getPortfolio,
    deletePortfolio,
    getUserPortfolios,
    updatePortfolio
}