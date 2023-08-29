const express= require('express')
const {registerUser, loginUser,logoutUser, forgotPassword, resetPassword, getUserDetail, updatePassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, DeleteUser} =require('../controllers/userController')
const {isAuthenticatedUser, authorizedRoles}=require('../middleware/Auth')

const router=express.Router();

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').put(resetPassword)

router.route('/me').get(isAuthenticatedUser,getUserDetail)

router.route('/password/update').put(isAuthenticatedUser,updatePassword)

router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)

router.route('/admin/users').get(isAuthenticatedUser,authorizedRoles("admin"), getAllUsers);

router.route('/admin/user/:id').get(isAuthenticatedUser,authorizedRoles("admin"), getSingleUser).put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizedRoles("admin"),DeleteUser)

router.route('/logout').get(logoutUser)

module.exports=router


