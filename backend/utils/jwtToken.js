
//creating a token and saving into cookie
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    //options for cookie
    // const expireToken = 5;
    const options = {
        expires: new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
        httpOnly:true,
    }
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token
    })
}

module.exports=sendToken