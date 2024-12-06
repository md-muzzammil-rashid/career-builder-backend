import AsyncHandler from "../utils/AsyncHandler.js"
import ApiError from '../utils/ApiError.js'
import { UserModel } from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { HttpStatusCode } from 'axios'
import bcrypt from 'bcrypt'

const createUser = AsyncHandler(async (req, res, next) => {
    const { username, password, email } = req.body
    if ([username, password, email].some((field) => (field?.trim() == ("" || null || undefined)))) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await UserModel.findOne({ $or: [{ username: username }, { email: email }] })
    if (existedUser) {
        throw new ApiError(409, 'User with same username or email already existed')
    }

    const user = await UserModel.create({
        username,
        password,
        email
    })

    if (!user) {
        throw new ApiError(501, "Failed to create user")
    }
    const registeredUser = await UserModel.findById(user._id).select('-password -createdAt -updatedAt')

    res.status(201)
        .json(
            new ApiResponse(201, "User Created !!!", registeredUser)
        )

})

const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = await UserModel.findById(userId);
        const AccessToken = await user.generateAccessToken();
        const RefreshToken = await user.generateRefreshToken();
        user.refreshToken = RefreshToken;
        user.save({ validateBeforeSave: false })
        return { AccessToken, RefreshToken }
    } catch (error) {
        console.log("Error in generating Token", error)
        throw new ApiError(501, "Error in generating tokens")
    }
}

const userLogin = AsyncHandler(async (req, res, next) => {
    const { usernameORemail, password } = req.body;
    if ([usernameORemail, password].some((field) => field?.trim() === (null || "" || undefined))) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await UserModel.findOne({ $or: [{ username: usernameORemail }, { email: usernameORemail }] }).select('-savedResume')
    if (!user) {
        throw new ApiError(404, "User not existed")
    }
    if (! await user.isPasswordCorrect(password)) {
        throw new ApiError(401, "Invalid Credentials")
    }
    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id)

    res.status(202)
        .cookie("AccessToken", AccessToken)
        .cookie("RefreshToken", RefreshToken)
        .json(
            new ApiResponse(202, "Login Successful", { user: user, AccessToken, RefreshToken })
        )


})

const logoutUser = AsyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, { refreshToken: undefined })
    res.status(202)
        .clearCookie('AccessToken')
        .clearCookie('RefreshToken')
        .json(
            new ApiResponse(202, "Logout Successful")
        )
})

const uploadUserDetails = AsyncHandler(async (req, res, next) => {
    const dataToUpdate= Object.fromEntries(
        Object.entries(req.body).filter(([key]) => !['_id', 'email', 'password', 'username', 'resumeDetails', 'refreshToken', 'savedResume'].includes(key))
      );
    const updateUserDetails = await UserModel.findByIdAndUpdate(req.user._id, dataToUpdate, {new: true}).select('-password').lean();

    return res.status(HttpStatusCode.Ok)
        .json(
            new ApiResponse(200, "User Details Updated", updateUserDetails)
        )

})

const getUserInfo = AsyncHandler(async (req, res, next)=>{
    console.log('user info');
    const user = await UserModel.findById(req.user._id).select('-savedResume -resumeDetails -password').lean()
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    res.status(200)
        .json(
            new ApiResponse(200, "User Details", user)
        )
})

const changePassword = AsyncHandler(async (req, res, next)=>{
    const {oldPassword, newPassword} = req.body
    const user = await UserModel.findById(req.user._id)
    if(!await bcrypt.compare(oldPassword, user.password)){
        throw new ApiError(401, "Old password is incorrect")
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false})
    // const changedPassword = await UserModel.findByIdAndUpdate(  req.user._id, {password:newPassword})
    // if(!changedPassword) {
    //     throw new ApiError(501, "Failed to change password")
    // }
    console.log('password changed');
    res.status(200)
        .json(
            new ApiResponse(200, "Password Changed Successfully", {})
        )
})

const updateAccountDetails = AsyncHandler(async (req, res, next)=>{
    let {userData} = req.body
    userData = JSON.parse(userData)
    const user = await UserModel.findById(req.user.id)
    const isUserExist = await UserModel.findOne({email: userData.email})
    if(!isUserExist.equals(user._id) ){
        throw new ApiError(409, "User with same email already existed")
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, {
        'profileInfo.firstName': userData.firstName,
        'profileInfo.lastName': userData.lastName,
        'email': userData.email,
        'profileInfo.contact':userData.contact,
        'profileInfo.profession': userData.profession,
        'profileInfo.about': userData.about
    })

    if(!user){
        throw new ApiError(501, "Failed to update account details")
    }
    res.status(200)
    .json(
        new ApiResponse(200, "Account Details Updated Successfully", updatedUser)
    )
})

const profileCompletionStatus = AsyncHandler( async (req, res, next) => {
    const user = await UserModel.findById(req.user._id).lean();
    const profileCompletion = calculateProfileCompletion(user);
    res.status(200)
       .json(
            new ApiResponse(200, "Profile Completion Status", profileCompletion )
        )
})


export {
    createUser,
    userLogin,
    logoutUser,
    uploadUserDetails,
    getUserInfo,
    changePassword,
    updateAccountDetails,
    profileCompletionStatus
}

function calculateProfileCompletion (user) {
    // Weighting configuration
    const MANDATORY_WEIGHT = 0.75;
    const OPTIONAL_WEIGHT = 0.25;
  
    // Mandatory fields configuration
    const mandatoryFields = [
      { 
        category: 'Personal Info', 
        fields: [
          { 
            name: 'First Name', 
            path: 'profileInfo.firstName', 
            weight: 0.15,
            href: '/profile/personal-info'
          },
          { 
            name: 'Last Name', 
            path: 'profileInfo.lastName', 
            weight: 0.15,
            href: '/profile/personal-info'
          },
          { 
            name: 'Phone', 
            path: 'profileInfo.phone', 
            weight: 0.15,
            href: '/profile/contact'
          },
          { 
            name: 'Email', 
            path: 'profileInfo.email', 
            weight: 0.15,
            href: '/profile/contact'
          },
          { 
            name: 'LinkedIn', 
            path: 'profileInfo.links.linkedIn', 
            weight: 0.15,
            href: '/profile/social-links'
          }
        ]
      },
      { 
        category: 'Professional Details', 
        fields: [
          { 
            name: 'Education', 
            path: 'educations.length', 
            weight: 0.125,
            href: '/profile/education'
          },
          { 
            name: 'Projects', 
            path: 'projects.length', 
            weight: 0.125,
            href: '/profile/projects'
          },
          { 
            name: 'Skills', 
            path: 'skills', 
            weight: 0.125,
            href: '/profile/skills'
          }
        ]
      }
    ];
  
    // Optional fields configuration
    const optionalFields = [
      { 
        category: 'Additional Personal Info', 
        fields: [
          { 
            name: 'About', 
            path: 'profileInfo.about', 
            weight: 0.05,
            href: '/profile/about'
          },
          { 
            name: 'Profile Picture', 
            path: 'profileInfo.profilePicture', 
            weight: 0.05,
            href: '/profile/photos'
          },
          { 
            name: 'Address', 
            path: 'profileInfo.address', 
            weight: 0.05,
            href: '/profile/address'
          }
        ]
      },
      { 
        category: 'Professional Extras', 
        fields: [
          { 
            name: 'Experience', 
            path: 'experience.length', 
            weight: 0.05,
            href: '/profile/experience'
          },
          { 
            name: 'Certifications', 
            path: 'certifications.length', 
            weight: 0.05,
            href: '/profile/certifications'
          },
          { 
            name: 'Achievements', 
            path: 'achievements.length', 
            weight: 0.05,
            href: '/profile/achievements'
          }
        ]
      }
    ];
  
    // Helper function to check field completion
    const isFieldCompleted = (user, path) => {
        const pathParts = path.split('.');
        let value = user;
        
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          if (value === undefined) return false;
          value = value[part];
      
          // Special handling for last part of the path
          if (i === pathParts.length - 1) {
            if (part === 'length') {
              return value > 0;
            }
      
            return value !== undefined && value !== null && value !== '';
          }
        }
      
        return false;
      };
  
    // Calculate mandatory field completion
    let mandatoryCompletion = 0;
    const fieldsToComplete = [];
  
    mandatoryFields.forEach(category => {
      const categoryFields = {
        category: category.category,
        fields: category.fields.map(field => {
          const completed = isFieldCompleted(user, field.path);
          if (!completed) {
            mandatoryCompletion += field.weight;
          }
          return {
            name: field.name,
            completed,
            href: field.href
          };
        })
      };
      fieldsToComplete.push(categoryFields);
    });
  
    // Calculate optional field completion
    let optionalCompletion = 0;
    optionalFields.forEach(category => {
      const categoryFields = {
        category: category.category,
        fields: category.fields.map(field => {
          const completed = isFieldCompleted(user, field.path);
          if (completed) {
            optionalCompletion += field.weight;
          }
          return {
            name: field.name,
            completed,
            href: field.href
          };
        })
      };
      fieldsToComplete.push(categoryFields);
    });
  
    // Calculate total percentage
    const percentComplete = Math.min(
      ((MANDATORY_WEIGHT * (MANDATORY_WEIGHT - mandatoryCompletion)) + 
       (OPTIONAL_WEIGHT * optionalCompletion)) * 100, 
      100
    );
  
    // Determine completion color
    const getCompletionColor = (percent) => {
      if (percent < 20) return '#FF4136';  // Dark Red
      if (percent < 40) return '#FF851B';  // Orange
      if (percent < 60) return '#FFDC00';  // Yellow
      if (percent < 80) return '#2ECC40';  // Green
      return '#3D9970';  // Dark Green
    };
  
    return {
      percentComplete: Math.round(percentComplete),
      mandatoryFieldsCompleted: mandatoryCompletion === 0,
      completionColor: getCompletionColor(percentComplete),
      fieldsToComplete
    };
  }