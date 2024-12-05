import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type:String
    },
    url: {
        type: String
    },
    analysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResumeAnalysis',
    },
    filename:{
        type: String,
    }
})

export default mongoose.model('Resume', resumeSchema)