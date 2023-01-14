const { protectedRoutes, allowedTo } = require('../user/user.auth');
const { addToCart, deleteCart, cartList, getSpecificCart, updateCartStatus } = require('./cart.service');

const router= require('express').Router();

router.use(protectedRoutes, allowedTo("user"))
router.route('/').post(addToCart).get(cartList);
router.route('/:id').delete(deleteCart).get(getSpecificCart).put(updateCartStatus)


module.exports= router;