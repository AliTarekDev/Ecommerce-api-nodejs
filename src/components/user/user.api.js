const { signUp, signIn, protectedRoutes, allowedTo } = require("./user.auth");
const {
  createUser,
  getUsers,
  getSpecificUser,
  deleteUser,
  updateUser,
  changePassword,
} = require("./user.service");

const router = require("express").Router();

router.route("/").post(createUser).get(getUsers);
router
  .route("/:id")
  .get(protectedRoutes, allowedTo("admin"), getSpecificUser)
  .delete(protectedRoutes,allowedTo("admin"),deleteUser)
  .put(updateUser);

router.route("/changePassword/:id").patch(changePassword);
router.post("/signup", signUp);
router.post("/signin", signIn);
module.exports = router;
