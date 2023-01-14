const AppError = require("../../utils/AppError");
const { checkAsyncError } = require("../../utils/catchAsync");
const userModel = require("../user/user.model");

exports.createAddress= checkAsyncError(async (req,res,next)=> {

    let {addresses}= await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: {addresses: req.body}
    }, {new: true});

    !addresses && next(new AppError("Cannot add address", 500))
    addresses && res.status(201).json({message: "address Added Successfully !", addresses});
});



exports.deleteFromAddress= checkAsyncError(async (req,res,next)=> {

    let {addresses}= await userModel.findByIdAndUpdate(req.user._id, {
        $pull: {addresses: {_id: req.body.address}}
    }, {new: true});

    !addresses && next(new AppError("Cannot Delete Address !", 500))
    addresses && res.status(201).json({message: "Address Deleted !", addresses});
});


exports.getAdresses= checkAsyncError(async (req,res,next)=> {

    let {addresses}= await userModel.findById(req.user._id)

    !addresses && next(new AppError("Cannot Get addresses", 404))
    addresses && res.status(201).json({message: "List of addresses !", addresses});
})