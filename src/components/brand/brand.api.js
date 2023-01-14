const { uploadSingleFile } = require("../../utils/fileUpload");
const { protectedRoutes, allowedTo } = require("../user/user.auth");
const {
  getBrand,
  createBrand,
  deleteBrand,
  updateBrand,
  getBrandList,
} = require("./brand.service");

const router = require("express").Router();

router
  .route("/")
  .get(getBrandList)
  .post(protectedRoutes,allowedTo("admin"),uploadSingleFile("image", "brand"), createBrand);
router
  .route("/:id")
  .delete(protectedRoutes,allowedTo("admin"),deleteBrand)
  .put(protectedRoutes,allowedTo("admin"),uploadSingleFile("image", "brand"), updateBrand)
  .get(getBrand);

module.exports = router;
