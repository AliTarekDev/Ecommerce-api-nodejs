const { protectedRoutes, allowedTo } = require("../user/user.auth");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
} = require("./subcategory.service");

const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .post(protectedRoutes, allowedTo("admin"), createSubCategory)
  .get(getSubCategories);
router
  .route("/:id")
  .get(getSubCategory)
  .delete(protectedRoutes, allowedTo("admin"), deleteSubCategory)
  .put(protectedRoutes, allowedTo("admin"), updateSubCategory);

module.exports = router;
