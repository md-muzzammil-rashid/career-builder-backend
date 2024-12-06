import { GoogleGenerativeAI } from "@google/generative-ai";
import {cleanJSON} from './openAi.js';
import { generatePromptForAnalyzingResume, generatePromptForGeneratePortfolioWithResume, generateResumeWithAIPrompt } from "./promptGenerator.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const generatePortfolioContentWithResume = async (parsedResume) => {
    try {
        const prompt = generatePromptForGeneratePortfolioWithResume(parsedResume)
        const response = await model.generateContent(prompt);

        const result = response.response.text();
        return cleanAIResult(result)
    } catch (error) {
        console.log(error.message)
    }
}

const generateResumeAnalysis = async (parsedResume) => {
    try {
        const prompt = generatePromptForAnalyzingResume(parsedResume);

        const response = await model.generateContent(prompt);

        const result = response.response.text();
        return cleanAIResult(result)
    } catch (error) {
        console.log(error.message)
    }
}

const generateResumeWithAI = async (userData) => {
    try {
        const prompt = generateResumeWithAIPrompt(userData);
        const response = await model.generateContent(prompt);
        const result = response.response.text();
        return cleanAIResult(result)        
    } catch (error) {
        console.log(error.message)
    }
}

const cleanAIResult = (result) => {
    const cleanedResult = result
    .replace(/```json\n/g, '')
    .replace(/\n```/g, '');

    const sanitizedData = cleanJSON(cleanedResult)
    const jsonResult = JSON.parse(sanitizedData);

    return jsonResult;

}

export {
    generatePortfolioContentWithResume,
    generateResumeAnalysis,
    generateResumeWithAI
}