const ErrorHandler =require('../utils/errorHandler')

module.exports=(err,req,res,next)=>{
    
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server error";

    //wrong mongodb id error
    if(err.name === "CastError"){
        const message=`Resource not found Invalid id:${err}`;
        console.log(err)
        err=new ErrorHandler(message,400)
    }

    // mongoose duplicate key error
    if(err.code === 11000){
        console.log(Object.keys(err.keyValue))
        const message=`Duplicate ${Object.keys(err.keyValue)} is entered`;
        err=new ErrorHandler(message,400)
    }

    //wrong json web token error
    if(err.name === "JsonWebTokenError"){
        const message =`Json web token is invalid,try again`;
        err =new ErrorHandler(message,400);
    }

    //Jwt expire Error

    if(err.name === "TokenExpiredError"){
        const message=`json web token is expired,try again`;
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })

}

