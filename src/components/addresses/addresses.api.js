const { protectedRoutes, allowedTo } = require("../user/user.auth");
const { createAddress, deleteFromAddress, getAdresses } = require("./addresses.service");

const router = require("express").Router();

router.use(protectedRoutes, allowedTo("user"))
router
  .route("/")
  .patch(createAddress)
  .delete(deleteFromAddress)
  .get(getAdresses)

module.exports = router;
