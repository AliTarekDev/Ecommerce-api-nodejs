const Category = require("../category/category.model");
const slugify = require("slugify");
const factory= require('../handler/hadler.factory');
const subCategory = require("./subcategory.model");
const { checkAsyncError } = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");

exports.createSubCategory = checkAsyncError(async (req, res, next) => {
  const { name, category } = req.body;

  const categoryExist = await Category.findById(category);

  if (!categoryExist) {
    return next(new AppError("cannot Find Category", 404));
  }

  let subcategory = new subCategory({ name, category, slug: slugify(name) });

  subcategory = await subcategory.save();

  res.status(200).json({ message: "new sub category !", subcategory });
});

//To Get list of subcategories
exports.getSubCategories = checkAsyncError(async (req, res, next) => {

    let filter= {};
    if(req.params.categoryId) {
        filter= {category: req.params.categoryId}
    }
  const subCategoryList = await subCategory.find(filter);

  if (!subCategoryList)
    return next(new AppError("Cannot get any subCategories !", 404));

  return res.status(200).json(subCategoryList);
});

//To Get Specific subCategory
exports.getSubCategory = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let subcategory = await subCategory.findById(id);

  if (!subcategory)
    return next(new AppError("Cannot get any subCategories !", 404));

  return res.status(200).json(subcategory);
});

//Get subcategories that have same categories

// exports.getSpecificSubCategories = checkAsyncError(async (req, res, next) => {
//   const { id } = req.params;
//   const subCategories = await subCategory.find({ category: id });

//   if (!subCategories)
//     return next(new AppError("Cannot get sub categories"), 404);

//     res.status(200).json(subCategories)
// });

//To Delete Specific subCategory
exports.deleteSubCategory = factory.deleteOne(subCategory);

//To update Specific subCategory
exports.updateSubCategory = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategoryExist = await subCategory.findById(id).populate("category");
  if (!subCategoryExist) return next(new AppError("Cannot Find Category"));

  let categoryData;

  if (req.body.category) {
    categoryData = category;
  } else {
    categoryData = subCategoryExist.category._id;
  }

  const subcategory = await subCategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name), category: categoryData },
    { new: true }
  );

  if (!subcategory) return next(new AppError("Cannot Update category !", 404));

  res
    .status(200)
    .json({ message: "Category Updated Successfully !", subcategory });
});
