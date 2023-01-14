const slugify = require("slugify");
const { checkAsyncError } = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");


exports.deleteOne= (Model)=> {
    return checkAsyncError(async (req, res, next) => {
        const { id } = req.params;
      
        const document = await Model.findByIdAndRemove(id);
      
        if (!document)
          return next(new AppError("cannot delete document !", 404));
      
        res.status(200).json({ message: "document Deleted Successfully !" });
      });
}

exports.createUser= (Model)=> {
  return checkAsyncError(async (req, res, next) => {
      const { name, email, password, phone } = req.body;
    
      let userExist = await Model.findOne({ email });
    
      userExist && next(new AppError("user already exists !", 500));
    
      // const hash = await bcrypt.hash(password, 8);
    
      let user = new Model({ name, email, password, phone });
    
      user = await user.save();
    
      user && res.status(201).json({ message: "User Created !", user });
    });
}