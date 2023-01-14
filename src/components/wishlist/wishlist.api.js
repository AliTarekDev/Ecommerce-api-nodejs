const { protectedRoutes, allowedTo } = require("../user/user.auth");
const { createWishlist, deleteFromWishlist, getWishlist } = require("./wishlist.service");

const router = require("express").Router();

router.use(protectedRoutes, allowedTo("user"))
router
  .route("/")
  .patch(createWishlist)
  .delete(deleteFromWishlist)
  .get(getWishlist)

module.exports = router;
