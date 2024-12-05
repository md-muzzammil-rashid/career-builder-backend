import OpenAI from "openai";
import { generatePromptForGeneratePortfolioWithResume, generatePromptForGeneratePortfolioWithUserDataAndResume } from "./promptGenerator.js";
const openai =new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generatePortfolioContentWithUserDataAndResume = async (parsedResume, userData) => {
    try {
        const prompt = generatePromptForGeneratePortfolioWithUserDataAndResume(parsedResume, userData)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "user", "content": prompt}
            ],
            max_tokens: 2000,
            temperature: 0.7,
        })

        const result = response.choices[0].message.content.trim();
        const cleanedResult = result
            .replace(/```json\n/g, '')
            .replace(/\n```/g, '');
        const sanitizedData = cleanJSON(cleanedResult);
        const jsonResult = JSON.parse(sanitizedData);
        return jsonResult;
    } catch (error) {
        
    }
}
const generatePortfolioContentWithResume = async (parsedResume) => {
    try {
        const prompt = generatePromptForGeneratePortfolioWithResume(parsedResume)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "user", "content": prompt}
            ],
            max_tokens: 2000,
            temperature: 0.7,
        })

        const result = response.choices[0].message.content.trim();
        const cleanedResult = result
            .replace(/```json\n/g, '')
            .replace(/\n```/g, '');
        const sanitizedData = cleanJSON(cleanedResult);
        const jsonResult = JSON.parse(sanitizedData);
        return jsonResult;
    } catch (error) {
        console.log(error.message)
    }
}

export const cleanJSON = (jsonString) => {
    // Remove unexpected control characters
    return jsonString
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Non-printable ASCII
        .replace(/\s{2,}/g, ' ') // Excessive spaces
        .replace(/:\s+"/g, ': "') // Fix space before quotes
        .trim();
};

export {
    generatePortfolioContentWithUserDataAndResume,
    generatePortfolioContentWithResume
}