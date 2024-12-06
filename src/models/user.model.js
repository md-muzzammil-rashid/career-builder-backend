import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  profileInfo: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String
    },
    about: {
      type: String
    },
    phone: {
      type: String
    },
    profilePicture: {
      type: String,
      default: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    },
    email: { type: String },
    address: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
    links: {
      linkedIn: { type: String },
      github: { type: String },
      portfolio: { type: String },
    },
  },
  experience: [{
    employer: { type: String },
    jobTitle: { type: String },
    startDate: {
      month: { type: String },
      year: { type: String },
    },
    endDate: {
      month: { type: String },
      year: { type: String },
    },
    location: { type: String },
    contributions: [{
      id: { type: String },
      text: { type: String },
    }],
  }],
  educations: [{
    degree: { type: String },
    fieldOfStudy: { type: String },
    schoolName: { type: String },
    city: { type: String },
    startDate: {
      month: { type: String },
      year: { type: String },
    },
    endDate: {
      month: { type: String },
      year: { type: String },
    },
    grade: { type: String },
    marks: { type: String },
  }],
  skills: {
    languages: [String],
    frameworks: [String],
    tools: [String],
    technologies: [String],
  },
  projects: [{
    title: { type: String },
    shortDescription: { type: String },
    liveLink: { type: String },
    githubLink: { type: String },
    projectDescription: [{
      id: { type: String },
      text: { type: String },
    }],
  }],
  achievements: [{
    achievementTitle: { type: String },
    achievementPoints: [{
      id: { type: String },
      text: { type: String },
    }],
  }],
  certifications: [{
    title: { type: String },
    certificationLink: { type: String },
    certificateDescription: { type: String },
  }],
  resumeDetails: {
    type: Object,
    default: {}
  },
  refreshToken: {
    type: String,
    default: null
  },
  savedResume: [
    {

    }
  ],



}, { timestamps: true })

UserSchema.pre("save", async function (next) {
  if (this.isModified('password')) {
    console.log('password is changed');
    this.password = await bcrypt.hash(this.password, 5)
  }
  next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function () {
  return await jwt.sign({
    _id: this._id,
    username: this.username
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
UserSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const UserModel = mongoose.model('User', UserSchema)
