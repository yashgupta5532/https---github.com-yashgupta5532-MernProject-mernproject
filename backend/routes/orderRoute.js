const express=require('express');

const {isAuthenticatedUser,authorizedRoles}=require('../middleware/Auth')

const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, DeleteOrder } = require('../controllers/orderController');

const router=express.Router();

router.route('/order/new').post(isAuthenticatedUser,newOrder)

router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)

router.route('/orders/me').get(isAuthenticatedUser,myOrders)

router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles("admin"),getAllOrders)

router.route('/admin/order/:id').put(isAuthenticatedUser,authorizedRoles("admin"),updateOrder).delete(isAuthenticatedUser,authorizedRoles("admin"),DeleteOrder)





module.exports=router