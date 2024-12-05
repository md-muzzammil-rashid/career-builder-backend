const generatePromptForGeneratePortfolioWithUserDataAndResume = (
  parsedResume,
  userData
) => {
  const prompt = `
        You are tasked with generating JSON data for a portfolio web application. Utilize the provided \`userData\` and \`parsedResume\` content to populate the following schema. Ensure that: 
      
        1. **Data Deduplication**: Merge information from \`userData\` and \`parsedResume\`, giving priority to \`userData\` in case of conflicts. Remove duplicate entries in lists (e.g., job profiles, skills, education, experience).
      
        2. **JSON Structure Compliance**: The output JSON must adhere strictly to the provided portfolio schema below.
      
        3. **Data Parsing and Mapping**: Map relevant fields from \`parsedResume\` to corresponding schema properties, ensuring consistency. For example:
           - Extract email, phone, and location from \`parsedResume\` if not provided in \`userData\`.
           - Map experience, projects, and education details accurately.
      
        4. **Social Links**: Populate \`socialLinks\` from \`userData\` if available. If absent, infer links from \`parsedResume\` based on typical keywords (e.g., LinkedIn, GitHub).
      
        5. **Skills Categorization**: Classify skills into \`technicalSkills\` and \`softSkills\` based on context. Include relevant \`emoji\` fields using defaults where unavailable.
      
        6. **Comprehensive Information**: Populate all fields in the schema as much as possible from the provided data.

        7. **Job Profiles and Major Job Profile**: Use the \`parsedResume\` and \`userData\` to find the job profiles and major job profile based on Experience and Projects.

        8. **Project Description**: Utilize project details from both \`userData\` and \`parsedResume\` and generate descriptions in three points, in first point mention the Objective or Purpose of the Project, in second point mention the responsibilities and role and in third point mention the key features and mention the technology used in the project.
      

        9. **Strict Output Requirement**: Return only the resulting JSON object. No additional text, explanations, or commentary should be included in the output.
      
        Portfolio Schema:
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
      
        Input Data:
        - \`userData\`: ${userData}
        - \`parsedResume\`: ${parsedResume}
      
        Generate the JSON object for the portfolio using the above schema, ensuring the data is accurate, complete, and deduplicated. Output **only** the JSON object, without any additional text or explanation. Only and only JSON
        `;
  return prompt.trim();
};

const generatePromptForGeneratePortfolioWithResume = (
    parsedResume
  ) => {
    const prompt = `
          You are tasked with generating JSON data for a portfolio web application. Utilize the provided \`parsedResume\` content to populate the following schema. Ensure that: 
        
          1. **JSON Structure Compliance**: The output JSON must adhere strictly to the provided portfolio schema below.
        
          2. **Data Parsing and Mapping**: Map relevant fields from \`parsedResume\` to corresponding schema properties, ensuring consistency. For example:
             - Extract email, phone, and location from \`parsedResume\` if not provided in \`userData\`.
             - Map experience, projects, and education details accurately.
        
          4. **Social Links**: Populate \`socialLinks\` from \`parsedResume\` if available. 
        
          5. **Skills Categorization**: Classify skills into \`technicalSkills\` and \`softSkills\` based on context. Include relevant \`emoji\` fields using defaults where unavailable.
        
          6. **Comprehensive Information**: Populate all fields in the schema as much as possible from the provided data.
  
          7. **Job Profiles and Major Job Profile**: Use the \`parsedResume\` to find the job profiles and major job profile based on Experience and Projects.
  
          8. **Project Description**: Utilize project details from \`parsedResume\` and generate descriptions in three points, in first point mention the Objective or Purpose of the Project, in second point mention the responsibilities and role and in third point mention the key features and mention the technology used in the project.
        
  
          9. **Strict Output Requirement**: Return only the resulting JSON object. No additional text, explanations, or commentary should be included in the output.
        
          Portfolio Schema:
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
        
          Input Data:
          - \`parsedResume\`: ${parsedResume}
        
          Generate the JSON object for the portfolio using the above schema, ensuring the data is accurate, complete, and deduplicated. Output **only** the JSON object, without any additional text or explanation. Only and only JSON
          `;
    return prompt.trim();
  };
  

  export {
    generatePromptForGeneratePortfolioWithUserDataAndResume,
    generatePromptForGeneratePortfolioWithResume
  }