import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    socialLinks:{
        linkedin: {type: String},
        twitter: {type: String},
        dev: {type: String},
        mediam:{type: String},
        instagram:{type: String},
        github:{type: String},
        leetcode:{type: String},
        gmail:{type: String},
        youtube:{type: String}
    },
  personalInfo:{
    profilePhoto:{type:String},
    jobProfiles:[{type:String}],
    userSummery:{type: String},
    majorJobProfile:{type: String},
    email:{type:String},
    phone:{type:String},
    location:{type:String},
    gDriveResumeLink:{type:String},
    gender:{type:String},
    firstName:{type:String},
    lastName:{type:String},
  },
  skills:{
    technicalSkills:[{
  label:{type:String},
  emoji:{type:String},
  logo:{type:String}
}],
softSkills:[{
  label:{type:String},
  emoji:{type:String},
}]
  },
  education:[{
    instituteName:{type:String},
    location:{type:String},
    startDate:{type:String},
    endDate:{type:String},
    degree:{type:String},
    specialization:{type:String},
    imageUrl:{type:String}
  }],
  experience:[{
    jobRole:{type:String},
    companyName:{type:String},
    startDate:{type:String},
    endDate:{type:String},
    responsibilities:[{type:String}],
    location:{type:String},
  }],
  projects:[{
    title:{type:String},
    liveURL:{type:String},
    githubLink:{type:String},
    techStack:[{
        title:{type:String},
        emoji:{type:String}
    }],
    description:[{type:String}],
    startDate:{type:String},
    endDate:{type:String},
    imageUrl:[{type:String}]
   }],
  template:{
    type: String,
    default: "Template Light 01",
  },
  isActive:{
    type: Boolean,
    default: true,
  }
})

export default mongoose.model('PortfolioModel', portfolioSchema)