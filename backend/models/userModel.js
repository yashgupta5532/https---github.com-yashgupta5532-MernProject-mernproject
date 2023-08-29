const mongoose = require('mongoose')
const validator =require('validator')
const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto= require('crypto')
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name cannot be less than 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter your email"],
        unique: true,
        validate: [validator.isEmail, "Enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter the password"],
        minLength: [8, "Password cannot be less than 8 characters"],
        select:false
    },
    avatar:
    {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})

//creating  JWT TOKEN PAYLOAD
userSchema.methods.getJWTToken=function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES})
    
}

//compare password
userSchema.methods.comparePassword=async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating reset password token
userSchema.methods.getResetPasswordToken=function (){

    //Generating token
    let resetToken =crypto.randomBytes(20).toString("hex");

    //Hashing and adding reset token to userSchema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire=Date.now() + process.env.JWT_TOKEN_EXPIRES;

    return resetToken;

}

module.exports=mongoose.model("User",userSchema)