const Category = require("./category.model");
var slugify = require("slugify");
const AppError = require("../../utils/AppError");
const { checkAsyncError } = require("../../utils/catchAsync");
const ApiFeatures = require("../../utils/ApiFeatures");

//to Create Category
exports.createCategory = checkAsyncError(async (req, res) => {
  const { name } = req.body;

  if (!req.file) return new AppError("No such File or image !", 404);

  let imagePath = `${req.protocol}://${req.get("host")}/uploads/category/${
    req.file.filename
  }`;

  let category = new Category({ name, slug: slugify(name), image: imagePath });

  category = await category.save();

  res.status(201).json(category);
});

//To Get list of categories
exports.getCategories = checkAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .search()
    .fields()
    .sort();
  const categoryList = await apiFeatures.mongooseQuery;

  if (!categoryList)
    return next(new AppError("Cannot get any categories !", 404));

  return res.status(200).json(categoryList);
});

//To Get Specific Category
exports.getCategory = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let category = await Category.findById(id);

  if (!category) return next(new AppError("Cannot get any categories !", 404));

  return res.status(200).json(category);
});

//To Delete Specific Category
exports.deleteCategory = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findByIdAndRemove(id);

  if (!category) return next(new AppError("Cannot Delete category !", 404));

  res.status(200).json({ message: "Category Deleted Successfully !" });
});
//To update Specific Category
exports.updateCategory = checkAsyncError(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if(req.body.name) {

      req.body.slug= slugify(req.body.name);
  }

  let getCat= await Category.findById(id).select('image');


  let imagePath;
  if(req.file) {
    imagePath=  `${req.protocol}://${req.get("host")}/src/public/images/${
        req.file.filename
      }`;
  }else {
    imagePath= getCat.image;
  }
  const category = await Category.findByIdAndUpdate(
    id,
    { name, image: imagePath },
    { new: true }
  );

  if (!category) return next(new AppError("Cannot Update category !", 404));

  res
    .status(200)
    .json({ message: "Category Updated Successfully !", category });
});
