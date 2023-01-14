const { protectedRoutes, allowedTo } = require("../user/user.auth");
const { getReviewList, createReview, deleteReview, updatereview, getReview } = require("./review.service");


const router = require("express").Router();

router
  .route("/")
  .get(getReviewList)
  .post(protectedRoutes,allowedTo("user"), createReview);
router
  .route("/:id")
  .delete(protectedRoutes,allowedTo("user","admin"),deleteReview)
  .put(protectedRoutes,allowedTo("user"), updatereview)
  .get(getReview);

module.exports = router;
