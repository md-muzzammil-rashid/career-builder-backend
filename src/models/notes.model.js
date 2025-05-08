import mongoose, { Schema, model } from "mongoose";
// Schema definition for Course
const notesSchema = new Schema(
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        },
        title: { type: String },
        subject: { type: String },
        language: { type: String },
        image:{type:String},
        pdfUrl:{type:String},
        topics: { type: [String] },
    },
    {
        timestamps: true,
    }
);

export const Notes = model("Notes", notesSchema);