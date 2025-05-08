import mongoose, { model, Schema } from "mongoose";


// Schema definition for Course
const courseSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        title: { type: String, required: true },
        topics: { type: [String] },
        subject: { type: String },
        language: { type: String },
        image: { type: String },
        modules: {
            type: [{
                title: { type: String, required: true },
                description: { type: String, required: true },
                videoQuery: { type: String },
                video: { type: String },
                assessment: {
                    title: { type: String },
                    description: { type: String },
                    mcqQuestions: [{
                        question: { type: String },
                        options: { type: [String] },
                        correctAnswer: { type: String }
                    }]
                }
            }],
        }
    },
    {
        timestamps: true,
    }
);

export const Course = model("Course", courseSchema);