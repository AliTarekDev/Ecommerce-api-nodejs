const { uploadFields } = require("../../utils/fileUpload");
const { protectedRoutes, allowedTo } = require("../user/user.auth");
const {
  getproductList,
  createproduct,
  deleteproduct,
  updateproduct,
  getproduct,
} = require("./product.service");

const router = require("express").Router();
let arrayOfFields = [
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
];

router
  .route("/")
  .get(getproductList)
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadFields(arrayOfFields, "product"),
    createproduct
  );
router
  .route("/:id")
  .delete(protectedRoutes, allowedTo("admin"), deleteproduct)
  .put(protectedRoutes,allowedTo("admin"),updateproduct)
  .get(getproduct);

module.exports = router;
