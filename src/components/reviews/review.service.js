const { checkAsyncError } = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const reviewsModel = require("./reviews.model");

exports.createReview = checkAsyncError(async (req, res, next) => {
  const isReview= await reviewsModel.findOne({user: req.user._id, product: req.body.product});
  if(isReview) return res.status(404).json({message: "You created a review before !"})
  let review = new reviewsModel(req.body);

  review = await review.save();

  !review && next(new AppError("Cannot create review !", 404));
  review && res.status(200).json({ message: "new review Created !", review });
});

//To Get list of Review
exports.getReviewList = checkAsyncError(async (req, res, next) => {
  const review = await reviewsModel.find({});

  !review && next(new AppError("Cannot Get review List!", 404));
  review && res.status(200).json(review);
});

//To Get Specific review
exports.getReview = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let review = await reviewsModel.findById(id);

  !review && next(new AppError("Cannot Get review !", 404));
  review && res.status(200).json(review);
});

//To Delete Specific review
exports.deleteReview = checkAsyncError(async(req,res,next)=> {
    const {id}= req.params;

    let reviewExist= await reviewsModel.findById(id);

    if(req.user.role== "user") {
        if(reviewExist.user._id.toString() == req.user._id.toString()) {
            let review= await reviewsModel.findByIdAndDelete(id);

            !review && next(new AppError("Cannot Delete Review !", 400));
            review && res.status(200).json({message: "Review Deleted Successfully !"}); 
        }
        res.status(401).json({message: "user who created the review can delete it"})
    }else {
        if(req.user.role == "admin") {
            let review= reviewsModel.findByIdAndDelete(id);

            !review && next(new AppError("Cannot Delete Review !", 400));
            review && res.status(200).json({message: "Review Deleted Successfully !"}); 
        }

        res.status(401).json({message: "cannot delete it"})
    }

   
})

//To update Specific Review
exports.updatereview = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let isReview= await reviewsModel.findById(id);

  if(isReview.user._id.toString() == req.user._id.toString()) {
    const review = await reviewsModel.findByIdAndUpdate(id, req.body, { new: true });
    !review && next(new AppError("Cannot Get review !", 404));
    review &&
      res.status(200).json({ message: "review Updated Successfully !", review });
  }else {
    next(new AppError("cannot update the review you havn't created !", 400))
  }
 
});
