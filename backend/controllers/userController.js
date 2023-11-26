const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    sendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body; //taking from frontend
  //checking if email and password is given by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email and password", 404));
  }

  //checking if user exist  with entered email and password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  //verifying password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(user, 200, res);
});

//logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  const resetToken = user.getResetPasswordToken();

  console.log(resetToken);
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  console.log(resetPasswordUrl);
  const message = `Your reset password token is : \n\n\t ${resetPasswordUrl} \n\n   if you have not requested this email then please ignore it. `;
  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Recovery Password`,
      message,
    });
    console.log("sucess ture");
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}  successfully `,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log("finding "+ error)
    return next(new ErrorHandler(error.message, 400));
  }
});

//reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating a reset token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $lt: Date.now() },
  });
  //  console.log(user)
  if (!user) {
    return next(
      new ErrorHandler("Invalid token or token has been expired", 400)
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password donot match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//get user details  -->me Detail
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // console.log(user)
  res.status(200).json({
    success: true,
    user,
  });
});

//updateUserPassword
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("user not found ", 401));
  }
  const isPasswordMatch = user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Incorrect password,try again", 401));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password donot match", 401));
  }

  user.password = req.body.newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "password updated successfully",
    user,
  });
});

//update user profile

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if(req.body.avatar !=""){
    const user =await User.findById(req.user._id)
    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder:"avatars",
      width:150,
      crop:"scale"
    });
    newUserData.avatar={
      public_id :myCloud.public_id,
      url:myCloud.secure_url
    }
  }


  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModiy: false,
  });
  res.status(200).json({
    success: true,
    message: "user profile updated successfully",
  });
});

//get All users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error while fetching users:", error);
    // You may also pass the error to the 'next' function to handle it centrally.
    next(error);
  }
});

//get single user -->Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`user doesnot exist ${req.params.id}`, 401));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user role  -->Admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  //we have to add avatar through cloudinary later
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModiy: false,
  });
  res.status(200).json({
    success: true,
    message: "user role updated successfully",
    user,
  });
});

//Delete user -->Admin

exports.DeleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  await user.deleteOne();
  //we have to remove avatar through cloudinary later

  res.status(200).json({
    success: true,
    message: "user deleted successfully",
    user,
  });
});
