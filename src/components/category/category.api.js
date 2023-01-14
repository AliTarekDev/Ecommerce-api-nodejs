const {
  createCategory,
  getCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("./category.service");
const subCategoryRoute = require("../subcategory/subcategory.api");
const { uploadSingleFile } = require("../../utils/fileUpload");
const { protectedRoutes, allowedTo } = require("../user/user.auth");
const router = require("express").Router();

router.use("/:categoryId/subcategories", subCategoryRoute);
router
  .route("/")
  .post(protectedRoutes,allowedTo("admin"),uploadSingleFile("image", "category"), createCategory)
  .get(getCategories);
router
  .route("/:id")
  .get(getCategory)
  .delete(protectedRoutes,allowedTo("admin"),deleteCategory)
  .put(protectedRoutes,allowedTo("admin"),uploadSingleFile("image", "category"), updateCategory);
//have the same route of api it will be compined in one line

module.exports = router;
