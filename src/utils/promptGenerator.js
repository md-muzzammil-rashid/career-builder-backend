const generatePromptForGeneratePortfolioWithUserDataAndResume = (
  parsedResume,
  userData
) => {
  const prompt = `
Portfolio Generation Expert Instruction Set

Core Objective:
Craft a comprehensive, compelling portfolio representation that transforms raw professional data into a strategic, engaging narrative showcasing the professional's unique value proposition.

Detailed Generation Guidelines:

1. Data Integration Strategy:
- Implement advanced data merging techniques
- Prioritize userData over parsedResume
- Eliminate redundancies while preserving unique information
- Ensure maximum information capture with minimal duplication

2. Personal Branding Components:

A. Personal Information Optimization:
- Craft a compelling professional summary that encapsulates core professional identity
- Highlight career trajectory and unique professional value
- Ensure consistent, professional formatting of contact details
- Strategically select professional profile photo (if available)

B. Social Links Enhancement:
- Validate and standardize social media profile URLs
- Infer missing links using professional context clues
- Prioritize professional networking platforms
- Ensure link integrity and relevance

3. Skills Categorization Framework:
- Implement sophisticated skill classification
- Distinguish between technical and soft skills
- Assign contextually relevant emojis
- Group skills by proficiency and industry relevance
- Ensure comprehensive skill representation

4. Experience Narrative Construction:
- Transform job experiences into strategic career progression stories
- Use STAR (Situation, Task, Action, Result) methodology to describe contributions
- Quantify achievements with specific metrics and percentages where possible
- Highlight key achievements using quantifiable metrics
- Emphasize leadership, innovation, and impact
- Structure responsibilities to demonstrate professional growth
- Use action-oriented, results-driven language

5. Project Showcase Strategy:
Detailed Project Description Generation:
- First Point: Project Objective/Purpose
  * Clearly articulate project's strategic context
  * Explain problem statement or innovation driver
- Second Point: Responsibilities and Role
  * Describe specific contributions
  * Highlight individual impact and leadership
- Third Point: Technical Achievements
  * List key features and technical innovations
  * Specify technologies and tools utilized
  * Quantify project outcomes

6. Education Representation:
- Showcase academic journey strategically
- Highlight relevant coursework, achievements
- Include specialized certifications
- Demonstrate continuous learning commitment

7. ATS and Digital Portfolio Optimization:
- Ensure keyword-rich content
- Maintain clean, professional formatting
- Maximize discoverability across platforms
- Create content that resonates with target professional opportunities

Strict Output Requirements:
- Generate JSON strictly adhering to the provided schema
- Prioritize accuracy, completeness, and strategic presentation
- Output ONLY the JSON object
- No additional text or explanations

Portfolio Schema Reference:
{
    "socialLinks": {
        "linkedin": { "type": "String" },
        "twitter": { "type": "String" },
        "dev": { "type": "String" },
        "mediam": { "type": "String" },
        "instagram": { "type": "String" },
        "github": { "type": "String" },
        "leetcode": { "type": "String" },
        "gmail": { "type": "String" },
        "youtube": { "type": "String" }
    },
    "personalInfo": {
        "profilePhoto": { "type": "String" },
        "jobProfiles": [{ "type": "String" }],
        "userSummery": { "type": "String" },
        "majorJobProfile": { "type": "String" },
        "email": { "type": "String" },
        "phone": { "type": "String" },
        "location": { "type": "String" },
        "gDriveResumeLink": { "type": "String" },
        "gender": { "type": "String" },
        "firstName": { "type": "String" },
        "lastName": { "type": "String" }
    },
    "skills": {
        "technicalSkills": [{
            "label": { "type": "String" },
            "emoji": { "type": "String" },
        }],
        "softSkills": [{
            "label": { "type": "String" },
            "emoji": { "type": "String" }
        }]
    },
    "education": [{
        "instituteName": { "type": "String" },
        "location": { "type": "String" },
        "startDate": { "type": "String" },
        "endDate": { "type": "String" },
        "degree": { "type": "String" },
        "specialization": { "type": "String" },
        "imageUrl": { "type": "String" }
    }],
    "experience": [{
        "jobRole": { "type": "String" },
        "companyName": { "type": "String" },
        "startDate": { "type": "String" },
        "endDate": { "type": "String" },
        "responsibilities": [{ "type": "String" }],
        "location": { "type": "String" }
    }],
    "projects": [{
        "title": { "type": "String" },
        "liveURL": { "type": "String" },
        "githubLink": { "type": "String" },
        "techStack": [{
            "title": { "type": "String" },
            "emoji": { "type": "String" }
        }],
        "description": [{ "type": "String" }],
        "startDate": { "type": "String" },
        "endDate": { "type": "String" },
        "imageUrl": [{ "type": "String" }]
    }]
}

Input Context:
- \`userData\`: ${userData}
- \`parsedResume\`: ${parsedResume}

Final Instruction: Generate a JSON portfolio representation that transforms professional data into a compelling, strategic narrative. Output ONLY the JSON object.
`;
  return prompt.trim();
};

const generatePromptForGeneratePortfolioWithResume = (
    parsedResume
  ) => {
    const prompt = `
    Portfolio Generation Expert Instruction Set
    
    Core Objective:
    Craft a comprehensive, compelling portfolio representation that transforms raw professional data into a strategic, engaging narrative showcasing the professional's unique value proposition.
    
    Detailed Generation Guidelines:
    
    1. Data Integration Strategy:
    - Implement advanced data merging techniques
    - Prioritize userData over parsedResume
    - Eliminate redundancies while preserving unique information
    - Ensure maximum information capture with minimal duplication
    
    2. Personal Branding Components:
    
    A. Personal Information Optimization:
    - Craft a compelling professional summary that encapsulates core professional identity
    - Highlight career trajectory and unique professional value
    - Ensure consistent, professional formatting of contact details
    - Strategically select professional profile photo (if available)
    
    B. Social Links Enhancement:
    - Validate and standardize social media profile URLs
    - Infer missing links using professional context clues
    - Prioritize professional networking platforms
    - Ensure link integrity and relevance
    
    3. Skills Categorization Framework:
    - Implement sophisticated skill classification
    - Distinguish between technical and soft skills
    - Assign contextually relevant emojis
    - Group skills by proficiency and industry relevance
    - Ensure comprehensive skill representation
    
    4. Experience Narrative Construction:
    - Transform job experiences into strategic career progression stories
    - Use STAR (Situation, Task, Action, Result) methodology to describe contributions
    - Quantify achievements with specific metrics and percentages where possible
    - Highlight key achievements using quantifiable metrics
    - Emphasize leadership, innovation, and impact
    - Structure responsibilities to demonstrate professional growth
    - Use action-oriented, results-driven language
    
    5. Project Showcase Strategy:
    Detailed Project Description Generation:
    - First Point: Project Objective/Purpose
      * Clearly articulate project's strategic context
      * Explain problem statement or innovation driver
    - Second Point: Responsibilities and Role
      * Describe specific contributions
      * Highlight individual impact and leadership
    - Third Point: Technical Achievements
      * List key features and technical innovations
      * Specify technologies and tools utilized
      * Quantify project outcomes
    
    6. Education Representation:
    - Showcase academic journey strategically
    - Highlight relevant coursework, achievements
    - Include specialized certifications
    - Demonstrate continuous learning commitment
    
    7. ATS and Digital Portfolio Optimization:
    - Ensure keyword-rich content
    - Maintain clean, professional formatting
    - Maximize discoverability across platforms
    - Create content that resonates with target professional opportunities
    
    Strict Output Requirements:
    - Generate JSON strictly adhering to the provided schema
    - Prioritize accuracy, completeness, and strategic presentation
    - Output ONLY the JSON object
    - No additional text or explanations
    
    Portfolio Schema Reference:
    {
        "user": {
            "type": "mongoose.Schema.Types.ObjectId",
            "ref": "User"
        },
        "link": {
            "type": "String",
            "required": true
        },
        "socialLinks": {
            "linkedin": { "type": "String" },
            "twitter": { "type": "String" },
            "dev": { "type": "String" },
            "mediam": { "type": "String" },
            "instagram": { "type": "String" },
            "github": { "type": "String" },
            "leetcode": { "type": "String" },
            "gmail": { "type": "String" },
            "youtube": { "type": "String" }
        },
        "personalInfo": {
            "profilePhoto": { "type": "String" },
            "jobProfiles": [{ "type": "String" }],
            "userSummery": { "type": "String" },
            "majorJobProfile": { "type": "String" },
            "email": { "type": "String" },
            "phone": { "type": "String" },
            "location": { "type": "String" },
            "gDriveResumeLink": { "type": "String" },
            "gender": { "type": "String" },
            "firstName": { "type": "String" },
            "lastName": { "type": "String" }
        },
        "skills": {
            "technicalSkills": [{
                "label": { "type": "String" },
                "emoji": { "type": "String" },
            }],
            "softSkills": [{
                "label": { "type": "String" },
                "emoji": { "type": "String" }
            }]
        },
        "education": [{
            "instituteName": { "type": "String" },
            "location": { "type": "String" },
            "startDate": { "type": "String" },
            "endDate": { "type": "String" },
            "degree": { "type": "String" },
            "specialization": { "type": "String" },
            "imageUrl": { "type": "String" }
        }],
        "experience": [{
            "jobRole": { "type": "String" },
            "companyName": { "type": "String" },
            "startDate": { "type": "String" },
            "endDate": { "type": "String" },
            "responsibilities": [{ "type": "String" }],
            "location": { "type": "String" }
        }],
        "projects": [{
            "title": { "type": "String" },
            "liveURL": { "type": "String" },
            "githubLink": { "type": "String" },
            "techStack": [{
                "title": { "type": "String" },
                "emoji": { "type": "String" }
            }],
            "description": [{ "type": "String" }],
            "startDate": { "type": "String" },
            "endDate": { "type": "String" },
            "imageUrl": [{ "type": "String" }]
        }]
    }
    
    Input Context:
    - \`parsedResume\`: ${parsedResume}
    
    Final Instruction: Generate a JSON portfolio representation that transforms professional data into a compelling, strategic narrative. Output ONLY the JSON object.
    `;
    return prompt.trim();
  };
  
const generatePromptForAnalyzingResume = (parsedResume) => {
    const prompt = `
    You are tasked with analyzing a parsed resume and providing a detailed analysis in JSON format. Use the provided \`parsedResume\` data to evaluate the resume and generate a response based on the following schema. 
  
    Ensure:
    1. **Schema Compliance**: The output must strictly adhere to the provided schema.
    2. **Detailed Analysis**:
       - Provide a **score** for the overall quality of the resume on a scale of 0-100.
       - Identify **key suggestions** for improvement.
       - Highlight **areas for improvement** in terms of structure, content, and clarity.
       - Detect and list **grammar errors** in the text.
       - Identify **repetitive words** that could be rephrased or removed.
       - Offer **general improvement suggestions** for making the resume stand out.
       - For each section (e.g., Education, Experience, Skills), give:
         - **Score** for that section on a scale of 0-100.
         - **Feedback** specific to the section.
         - **Key improvements** tailored for the section.
  
    3. **Output Requirement**: 
       - Return only the resulting JSON object.
       - No additional text, commentary, or explanation should be included in the output.
  
    Resume Analysis Schema:
    {
      "score": { "type": "Number", "required": true },
      "keySuggestions": { "type": ["String"], "required": true },
      "areasForImprovement": { "type": ["String"], "required": true },
      "grammarErrors": { "type": ["String"], "required": true },
      "repetitiveWords": { "type": ["String"], "required": true },
      "improvementSuggestions": { "type": ["String"], "required": true },
      "sectionFeedback": [
        {
          "section": { "type": "String", "required": true },
          "score": { "type": "Number", "required": true },
          "feedback": { "type": "String", "required": true },
          "keyImprovements": { "type": ["String"], "required": true }
        }
      ]
    }
  
    Input Data:
    - \`parsedResume\`: ${parsedResume}
  
    Perform a detailed analysis of the resume based on this schema and output **only** the JSON object as per the requirements. No additional text, explanations, or commentary should be included.
    `;
    return prompt.trim();
  }
  
  const generateResumeWithAIPrompt = (userData) => {
    const prompt = `
    You are an expert resume writer and career strategist specializing in creating highly optimized, ATS-friendly resumes that effectively showcase professional achievements and potential.
    

      Resume Schema:
  {
   "profileInfo": {
    "firstName": "String",
    "lastName": "String",
    "about": "String",
    "phone": "String",
    "email": "String",
    "address": {
      "city": "String",
      "state": "String",
      "country": "String"
    },
    "links": {
      "linkedIn": "String",
      "github": "String",
      "portfolio": "String"
    }
  },
  "experience": [
    {
      "employer": "String",
      "jobTitle": "String",
      "startDate": {
        "month": "String",
        "year": "String"
      },
      "endDate": {
        "month": "String",
        "year": "String"
      },
      "location": "String",
      "contributions": [
        {
          "id": "String",
          "text": "String"
        }
      ]
    }
  ],
  "educations": [
    {
      "degree": "String",
      "fieldOfStudy": "String",
      "schoolName": "String",
      "city": "String",
      "startDate": {
        "month": "String",
        "year": "String"
      },
      "endDate": {
        "month": "String",
        "year": "String"
      },
      "grade": "String",
      "marks": "String"
    }
  ],
  "skills": {
    "languages": ["String"],
    "frameworks": ["String"],
    "tools": ["String"],
    "technologies": ["String"]
  },
  "projects": [
    {
      "title": "String",
      "shortDescription": "String",
      "liveLink": "String",
      "githubLink": "String",
      "projectDescription": [
        {
          "id": "String",
          "text": "String"
        }
      ]
    }
  ],
  "achievements": [
    {
      "achievementTitle": "String",
      "achievementPoints": [
        {
          "id": "String",
          "text": "String"
        }
      ]
    }
  ],
  "certifications": [
    {
      "title": "String",
      "certificationLink": "String",
      "certificateDescription": "String"
    }
  ]
  }

    Your task is to transform the provided user profile data into a compelling, professionally crafted resume that:
    - Maximizes ATS (Applicant Tracking System) compatibility
    - Highlights key achievements using powerful, action-oriented language
    - Demonstrates professional growth and impact
    - Tailors content to the target industry and role
    
    Resume Generation Guidelines:
    
    1. Personal Details and Professional Summary:
    - Craft a strategic professional summary that encapsulates the candidate's core professional value proposition
    - Use industry-specific keywords that align with the user's target roles
    - Ensure all contact information is professionally formatted
    
    2. Experience Section:
    For each professional experience:
    - Begin with a high-impact opening statement that frames the role's strategic importance
    - Use STAR (Situation, Task, Action, Result) methodology to describe contributions
    - Quantify achievements with specific metrics and percentages where possible
    - Incorporate industry-specific keywords and technical skills
    - Highlight responsibilities that demonstrate leadership, innovation, and problem-solving
    - Structure descriptions to show progressive responsibility and career growth
    
    3. Project Descriptions:
    For each project, create a comprehensive description with three critical components:
    - Objective/Purpose: Clearly articulate the project's strategic goal and business/technical context
    - Responsibilities and Role: Detailed explanation of the specific contributions, leadership, and individual impact
    - Technical Achievements: 
      * Highlight key features and technical innovations
      * List specific technologies, frameworks, and tools used
      * Quantify project outcomes (e.g., performance improvements, cost savings)
    
    4. Education Section:
    - Emphasize relevant coursework, academic achievements, and skills
    - Include academic projects, research, or notable accomplishments
    - Highlight certifications, specialized training, or continuous learning efforts
    
    5. Skills Section:
    - Create a comprehensive skills matrix that includes:
      * Technical skills
      * Soft skills
      * Industry-specific competencies
    - Organize skills by proficiency and relevance to target roles
    - Use standard industry terminology and avoid jargon
    
    6. ATS Optimization Strategies:
    - Use standard, clean formatting
    - Incorporate relevant keywords from job descriptions
    - Ensure consistent, professional formatting
    - Avoid graphics, complex layouts, or non-standard fonts
    
    Input Constraints and Considerations:
    - Leverage all available information in the user profile
    - If information is sparse, use professional inference and standard industry practices
    - Maintain authenticity while presenting the most compelling professional narrative
    
    Input Data:
    \`userData\`: ${userData}
    
    Output Requirements:
    - Produce a JSON object that matches the provided schema
    - Ensure all generated content is professional, accurate, and reflective of the user's professional profile
    - Focus on creating a narrative of professional growth and potential
    
    Final Instructions:
    - Generate a resume that would pass ATS screening
    - Create content that is both keyword-optimized and genuinely reflective of the professional's capabilities
    - Prioritize clarity, impact, and strategic presentation of professional achievements
    
    Respond with ONLY the JSON resume object, formatted according to the specified schema.
    `;
      return prompt.trim();
  }

  
  

  export {
    generatePromptForGeneratePortfolioWithUserDataAndResume,
    generatePromptForGeneratePortfolioWithResume,
    generatePromptForAnalyzingResume,
    generateResumeWithAIPrompt
  }