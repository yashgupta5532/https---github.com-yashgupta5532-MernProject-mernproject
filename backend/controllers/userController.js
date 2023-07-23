const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const User=require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const sendToken=require('../utils/jwtToken')

// const dotenv=require('dotenv');
// dotenv.config({path:"/backend/config/config.env"})

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body

    const user =await User.create({
        name,email,password,avatar:{
            public_id:"sample id change in cloud",
            url:"Profileurl"
        }
    })
    // const token=user.getJWTToken();
    // console.log(token)
    // res.status(200).json({
    //     success:true,
    //     user,
    //     token
    // })
   sendToken(user,201,res)
})

exports.loginUser=catchAsyncErrors(async (req,res,next)=>{
    const {email,password} =req.body;

    //checking if email and password is given by user
    if(!email || !password){
        return next (new ErrorHandler("Please enter your email and password",400))
    }

    //checking if user exist  with entered email and password
    const user =await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password"))
    }

    //verifying password
    const isPasswordMatch =user.comparePassword();
    if(!isPasswordMatch){
        return next(new ErrorHandler ("Invalid email or password",400));
    }
    // res.status(200).json({
    //     success:true,
    //     message:"logine in successfully"
    // })
    sendToken(user,200,res);
    
})


//logout user

exports.logoutUser=catchAsyncErrors(async (req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"Logout successfully"
    })
})


// forgot password

exports.forgotPassword=catchAsyncErrors(async (req,res,next)=>{
    const user =await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("user not found",404));
    }
    const resetToken=user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
})
