import mongoose, { model, Schema } from "mongoose";

const AssetsSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    filename: {
        type: String,
    },
    title:{
        type: String,
    },
    extension: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true});

export default model("AssetModel", AssetsSchema );