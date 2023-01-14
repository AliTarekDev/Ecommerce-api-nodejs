const { checkAsyncError } = require("../../utils/catchAsync");
const User = require("./user.model");
const AppError = require("../../utils/AppError");
const handler = require("../handler/hadler.factory");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**Create User */
exports.signUp = handler.createUser(User);

exports.signIn = checkAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  let userExist = await User.findOne({ email });

  !userExist && next(new AppError("Cannot Find This Email !", 401));

  let check = await bcrypt.compare(password, userExist.password);

  if (!check) {
    return next(new AppError("Invalid Password !", 404));
  }
  const token = jwt.sign(
    { id: userExist._id, role: userExist.role },
    process.env.KEY,
    { expiresIn: "1h" }
  );
  return res.status(200).json({ message: "User Authenticated !", token });
});

/***Handle Authentication */
exports.protectedRoutes = checkAsyncError(async (req, res, next) => {
  let checkHeaders = req.headers.authorization;

  if (!checkHeaders)
    return next(new AppError("user Not Authenticad, Login please !", 404));

  let token = checkHeaders.split(" ")[1];
  !token && next(new AppError("user Not Authenticad, Login please !", 404));
  let decoded = await jwt.verify(token, process.env.KEY);

  let user = await User.findById(decoded.id);

  if (!user) return next(new AppError("User Not Found !", 401));

  if (user.passwordCreatedAt) {
    let passwordChanged = parseInt(user.passwordCreatedAt.getTime() / 1000);
    if (passwordChanged > decoded.iat)
      return next(new AppError("user Not Found !", 404));
  }

  req.user = user;
  next();
});

/**Handle Authorization */
exports.allowedTo = (...roles) => {
  return checkAsyncError(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("User Not Authorized !", 404));
    }

    next();
  });
};
