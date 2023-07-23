const mongoose = require('mongoose')
const validator =require('validator')
const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto= require('crypto')

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
    // mobileNumber: {
    //     type: Number,
    //     required: [true, "Please Enter your mobileNumber"],
    //     maxLength: [10, "MobileNumber Cannot be greater than 10"],
    //     minLength: [10, "MobileNumber Cannot be less than 10"]
    // },
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
    resetPasswordExpire:Date

})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcrypt.hash(this.password,10);
})


//creating  JWT TOKEN PAYLOAD
userSchema.methods.getJWTToken=function (){
    // const secretKey=HAKDKAMDJAKDHAUEHIFAKLNV;
    return jwt.sign({id:this._id},HAKDKAMDJAKDHAUEHIFAKLNV,{expiresIn:5*24*60*60*1000})
}

// userSchema.methods.getJWTToken = function(){
//     return jwt.sign({id:this._id},HAKDKAMDJAKDHAUEHIFAKLNV,{expiresIn:5*24*60*60*1000})
// }

//compare password
userSchema.methods.comparePassword=async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generating reset password token
userSchema.methods.getResetPasswordToken=function (){

    //Generating token
    let resetToken =crypto.randomBytes(20).toString();

    //Hashing and adding reset token to userSchema
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire=Date.now() +15 *60*1000

    return resetToken;

}





module.exports=mongoose.model("User",userSchema)