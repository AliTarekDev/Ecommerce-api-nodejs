const AppError = require("../../utils/AppError");
const { checkAsyncError } = require("../../utils/catchAsync");
const userModel = require("../user/user.model");

exports.createWishlist= checkAsyncError(async (req,res,next)=> {

    let {wishlist}= await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: {wishlist: req.body.product}
    }, {new: true});

    !wishlist && next(new AppError("Cannot add product To wishlist", 500))
    wishlist && res.status(201).json({message: "product added To wishlist !", wishlist});
});



exports.deleteFromWishlist= checkAsyncError(async (req,res,next)=> {

    let {wishlist}= await userModel.findByIdAndUpdate(req.user._id, {
        $pull: {wishlist: req.body.product}
    }, {new: true});

    !wishlist && next(new AppError("Cannot add product To wishlist", 500))
    wishlist && res.status(201).json({message: "product Removed from wishlist !", wishlist});
});


exports.getWishlist= checkAsyncError(async (req,res,next)=> {

    let {wishlist}= await userModel.findById(req.user._id)

    !wishlist && next(new AppError("Cannot Get wishlist", 404))
    wishlist && res.status(201).json({message: "List of wishlist !", wishlist});
})