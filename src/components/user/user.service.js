const { checkAsyncError } = require("../../utils/catchAsync");
const User = require("./user.model");
const AppError = require("../../utils/AppError");
const factory = require("../handler/hadler.factory");
const bcrypt = require("bcrypt");
const handler= require('../handler/hadler.factory');
/**Create User */
exports.createUser = handler.createUser(User)

/**Get User */

exports.getUsers = checkAsyncError(async (req, res, next) => {
  let mongooseQuery = User.find({});
  if (req.query.keyword) {
    let keyword = req.query.keyword;
    mongooseQuery
      .find({ name: { $regex: keyword, $options: "i" } })
      .select("name");
  }

  user = await mongooseQuery;
  !user && next(new AppError("Cannot find Users List !", 404));
  user && res.status(200).json(user);
});

/**Get Specific User */
exports.getSpecificUser = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let user = await User.findById(id);

  !user && next(new AppError("Cannot find User !", 404));
  user && res.status(200).json(user);
});

/**Delete User */
exports.deleteUser = factory.deleteOne(User);

/**Update User */

exports.updateUser = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  let checkPassword;
  if (req.body.password) {
    checkPassword = await bcrypt.hash(req.body.password, 8);
  } else {
    checkPassword = user.password;
  }

  req.body.password = checkPassword;

  let userUpdt = await User.findByIdAndUpdate(id, req.body, { new: true });

  !userUpdt && next(new AppError("User not updated !", 500));
  userUpdt && res.status(200).json(userUpdt);
});

/**Change admin password */

exports.changePassword = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  let checkPassword;
  if (req.body.password) {
    checkPassword = await bcrypt.hash(req.body.password, 8);
  } else {
    checkPassword = user.password;
  }

  req.body.password = checkPassword;
  req.body.passwordCreatedAt= Date.now();

  let userUpdt = await User.findByIdAndUpdate(id, req.body, { new: true });

  !userUpdt && next(new AppError("User not updated !", 500));
  userUpdt && res.status(200).json(userUpdt);
});
