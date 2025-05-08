import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs"
import * as marked from 'marked';
import puppeteer from 'puppeteer';
import { Dropbox } from 'dropbox';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const genAi = async (title, topics, subject, language) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Generate relevant content for the course titled "${title}" focused on the subject "${subject}" in the language "${language}".
        Include the specified topics: ${topics.join(", ")}.
        For each module, provide a specific search query string for the YouTube search API. The search query should:
        1. Include the phrase "in ${language} only" at the end of videoQuery.
        2. Ensure each query is unique to minimize the chance of retrieving the same video for multiple modules.
        3. Include specific keywords related to the module's content and its application.
        The course should have at least 10 modules, adding more if necessary.
        The flow of the course should progress from beginner to advanced.
        Create a JSON object for the course with the following structure:
        \`\`\`json
        {
            "title": "${title}",
            "topics": ["${topics.join('", "')}"],
            "subject": "${subject}",
            "language": "${language}",
            "modules": [   
                {
                    "title": "string",
                    "description": "string", // A summary of the module, up to 5 lines.
                    "videoQuery": "string", // Provide a search string for the YouTube search API
                    "assessment": {
                        "title": "string",
                        "description": "string",
                        "mcqQuestions": [
                            {
                                "question": "string",
                                "options": ["string1", "string2", "string3", "string4"],
                                "correctAnswer": "string"
                            },
                            {
                                "question": "string",
                                "options": ["string1", "string2", "string3", "string4"],
                                "correctAnswer": "string"
                            }
                        ]
                    }
                },
                {
                    "title": "string",
                    "description": "string", // A summary of the module, up to 5 lines.
                    "videoQuery": "string", // Provide a search string for the YouTube search API
                    "assessment": {
                        "title": "string",
                        "description": "string",
                        "mcqQuestions": [
                            {
                                "question": "string",
                                "options": ["string1", "string2", "string3", "string4"],
                                "correctAnswer": "string"
                            },
                            {
                                "question": "string",
                                "options": ["string1", "string2", "string3", "string4"],
                                "correctAnswer": "string"
                            }
                        ]
                    }
                }
                // Add more modules if necessary
            ]
        }
        \`\`\`
        Strictly return the only JSON structure and nothing else, also give within the limit output strictly.
        `;
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return { message: text };
    } catch (error) {
        console.error("Error:", error);
        throw new ApiError(500, "Failed to generate content");
    }
};

const genAiNotes = async (title, topics, subject, language) => {
    try {
        // Initialize the generative AI model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Create comprehensive and detailed notes titled "${title}" on the subject of "${subject}" in "${language}". 
The notes should cover the following topics extensively: ${topics.join(", ")}. 
Ensure each topic is thoroughly explained with relevant numerical examples, diagrams, and illustrations as needed. 
The content should be structured to span more than seven pages, providing in-depth coverage and detailed explanations suitable for semester exam preparation. 
Include additional sections or subsections where necessary to achieve the required length and depth, ensuring that the material is well-organized and easy to understand for exam preparation.`;        

        const result = await model.generateContent(prompt);
        const response = result.response;
        const markdownContent = response.text();

        const htmlContent = await marked.marked(markdownContent);

        let browser;
        try {
            // Launch Puppeteer without specifying executablePath
            browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--headless',
                    '--single-process',
                    '--no-zygote'
                ]
            });
        } catch (launchError) {
            console.error('Error launching Puppeteer:', launchError);
            throw new Error('Failed to launch Puppeteer');
        }

        const page = await browser.newPage();
        await page.setContent(`
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; }
                    p { margin-bottom: 15px; }
                    ul, ol { margin-left: 20px; }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                ${htmlContent}
            </body>
            </html>
        `);

        // Create PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            },
        });

        await browser.close();

        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate content");
    }
};


const generatePDF = async (title, markdownContent) => {
    const htmlContent = await marked.marked(markdownContent); // Convert Markdown to HTML

    // Launch Puppeteer with Render-specific args
    const browser = await puppeteer.launch({
        headless: true, // Ensure headless mode is enabled
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--remote-debugging-port=9222'
        ]
    });
    const page = await browser.newPage();

    // Set HTML content and generate PDF as Uint8Array
    await page.setContent(htmlContent);
    const pdfUint8Array = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            bottom: '20px',
            left: '20px',
            right: '20px'
        }
    });

    await browser.close();

    // Convert Uint8Array to Buffer
    const pdfBuffer = Buffer.from(pdfUint8Array);
    return pdfBuffer; // Return the Buffer for further use
};


const uploadToDropbox = async (pdfBuffer, title) => {
    const dbx = new Dropbox({ 
        accessToken: process.env.DROPBOX_ACCESS_TOKEN, 
        fetch: fetch 
    });

    // Sanitize filename more thoroughly
    const safeTitle = title.replace(/[^\w\-]/g, '_'); // Replace non-alphanumeric chars
    const fileName = `/${safeTitle}_Notes-${Date.now()}.pdf`;

    try {
        // Upload with overwrite mode
        const uploadResult = await dbx.filesUpload({
            path: fileName,
            contents: pdfBuffer,
            mode: { '.tag': 'overwrite' } // Overwrite if exists
        });

        // Get or create shared link
        const sharedLinkResult = await dbx.sharingListSharedLinks({
            path: uploadResult.result.path_lower,
            direct_only: true
        }).catch(async () => {
            // If no link exists, create one
            return await dbx.sharingCreateSharedLinkWithSettings({
                path: uploadResult.result.path_lower,
                settings: {
                    requested_visibility: { '.tag': 'public' }
                }
            });
        });

        // Extract URL (handle both list and create responses)
        const url = sharedLinkResult.result.links?.[0]?.url || sharedLinkResult.result.url;
        
        // Return direct download link
        return url.replace("?dl=0", "?dl=1");
    } catch (error) {
        console.error("Dropbox upload error:", error.error || error);
        throw new Error(`Failed to upload to Dropbox: ${error.error?.error_summary || error.message}`);
    }
};



export default {
    genAi,
    genAiNotes,
    uploadToDropbox
};