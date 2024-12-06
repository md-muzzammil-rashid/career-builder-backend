import { HttpStatusCode } from "axios";
import portfolioModel from "../models/portfolio.model.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {  generatePortfolioContentWithUserDataAndResume } from '../utils/openAi.js'
import { parsePDFBuffer, parsePDFLink } from '../utils/pdfParser.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { generatePortfolioContentWithResume } from '../utils/googleAi.js'
import { UserModel } from "../models/user.model.js";
import { mailSender } from "../utils/nodeMailer.js";

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

const getAuthorizedPortfolio = AsyncHandler(async (req, res, next) => {
    const {link} = req.params;
    const normalizedLink = link.toLowerCase();
    const portfolio = await portfolioModel.findOne({link: normalizedLink})

    if(!portfolio){
        return res.status(HttpStatusCode.NotFound)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }

    if(portfolio.user.toString()!== req.user._id.toString()){
        return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Unauthorized, "Unauthorized to Access This Portfolio"))
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

const changeUrl = AsyncHandler(async (req, res, next)=> {
    const {oldLink, newLink} = req.body;
    const normalizedLink = oldLink.toLowerCase();
    const newNormalizedLink = newLink.toLowerCase();
    const portfolio = await portfolioModel.findOne({link:normalizedLink})
    if(!portfolio) {
        return res.status(HttpStatusCode.Ok)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }
    if(portfolio.user.toString()!==req.user._id.toString()){
        return res.status(HttpStatusCode.Ok)
        .json(new ApiResponse(HttpStatusCode.Unauthorized, "Unauthorized to Update This Portfolio URL"))
    }
    const isLinkAlreadyOccupied = await portfolioModel.findOne({link:newNormalizedLink})
    if(isLinkAlreadyOccupied){
        return res.status(HttpStatusCode.Ok)
           .json(new ApiResponse(HttpStatusCode.Conflict, "New Link Already Occupied"))
    }

    portfolio.link = newNormalizedLink;
    await portfolio.save();
    return res.status(HttpStatusCode.Ok)
       .json(new ApiResponse(HttpStatusCode.Ok, "Portfolio URL Updated", portfolio))
})

const sendMail = AsyncHandler(async (req, res, next) => {
    const {email, subject, message, name} = req.body;
    const {link} = req.params;
    const normalizedLink = link.toLowerCase();
    const user = await portfolioModel.findOne({link: normalizedLink})
    if(!user) {
        return res.status(HttpStatusCode.NotFound)
           .json(new ApiResponse(HttpStatusCode.NotFound, "Portfolio Not Found"))
    }
    const receiverEmail = user.personalInfo.email
    if(!receiverEmail || !receiverEmail.trim().toLowerCase()){
        return res.status(HttpStatusCode.Ok)
           .json(new ApiResponse(HttpStatusCode.BadRequest, "User not able to accept email"))
    }
    const send = await mailSender(email, receiverEmail.trim().toLowerCase(), name, subject, message );
    if(!send){
        return res.status(HttpStatusCode.InternalServerError)
           .json(new ApiResponse(HttpStatusCode.InternalServerError, "Failed to send email"))
    }
    return res.status(HttpStatusCode.Ok)
     .json(new ApiResponse(HttpStatusCode.Ok, "Email sent successfully"))
})
export {
    generatePortfolio,
    isLinkAvailable,
    getPortfolio,
    deletePortfolio,
    getUserPortfolios,
    updatePortfolio,
    getAuthorizedPortfolio,
    changeUrl,
    sendMail
}