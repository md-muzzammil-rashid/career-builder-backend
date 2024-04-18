import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required : true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique:true,
        required: true,
        lowercase: true
    },
    profileInfo:{
        firstName:{
            type: String,
        },
        lastName:{
            type: String
        },
        Bio:{
            type: String
        },
        contact:{
            type: String
        },
        profession:{
            type:String
        },
        profilePicture:{
            type:String,
            default: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
        }
    },
    resumeDetails:{
        type:Object,
        default:{}
    },
    refreshToken:{
        type:String,
        default:null
    },
    savedResume:[
        {
            
        }
    ],


    
},{timestamps:true})

UserSchema.pre("save", async function(next){
    if(this.isModified('password')){
        console.log('password is changed');
        this.password = await bcrypt.hash(this.password , 5)
    }
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function(){
    return await jwt.sign({
        _id : this._id,
        username : this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
UserSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const UserModel = mongoose.model('User', UserSchema)
