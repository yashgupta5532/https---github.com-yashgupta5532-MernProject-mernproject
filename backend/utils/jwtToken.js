
//creating a token and saving into cookie
const sendToken = (user, statusCode, res) => {
    const token=user.getJWTToken();
    // console.log(token)
    //options for cookie
    const options = {
        expires: new Date(Date.now() +20 * 60 * 1000), //process.env.JWT_TOKEN_EXPIRES
        httpOnly:true,
    }
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token
    })
}

module.exports=sendToken