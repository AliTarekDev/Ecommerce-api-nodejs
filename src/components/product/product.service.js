const Product = require("./product.model");
const slugify = require("slugify");
const { checkAsyncError } = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
const ApiFeatures = require("../../utils/ApiFeatures");

exports.createproduct = checkAsyncError(async (req, res, next) => {
  const { name } = req.body;
  req.body.slug = slugify(name);

  let imagePath = `${req.protocol}/${req.get("host")}/uploads/product/`;
  req.body.imageCover = `${imagePath}${req.files.imageCover[0].filename}`;
  let imageArr = [];

  if (req.files.images) {
    req.files.images.forEach((ele) => {
      imageArr.push(`${imagePath}/${ele.filename}`);
    });
  }

  req.body.images = imageArr;

  let product = new Product(req.body);

  product = await product.save();

  !product && next(new AppError("Cannot create product !", 404));
  product &&
    res.status(200).json({ message: "new product Created !", product });
});

//To Get list of products
exports.getproductList = checkAsyncError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .search()
    .fields();
  const product = await apiFeatures.mongooseQuery;
  !product && next(new AppError("Cannot Get product List!", 404));
  product && res.status(200).json({ page: apiFeatures.page, product });
});

//To Get Specific product
exports.getproduct = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);

  !product && next(new AppError("Cannot Get product !", 404));
  product && res.status(200).json(product);
});

//To Delete Specific product
exports.deleteproduct = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findByIdAndRemove(id);

  !product && next(new AppError("Cannot Get product !", 404));
  product &&
    res.status(200).json({ message: "product Deleted Successfully !" });
});

//To update Specific subCategory
exports.updateproduct = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  if (req.body.slug) {
    req.body.slug = slugify(name);
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    { new: true }
  );
  !product && next(new AppError("Cannot Get product !", 404));
  product &&
    res
      .status(200)
      .json({ message: "product Updated Successfully !", product });
});

/*
let page = req.query.page * 1 || 1;
if (page < 0) page = 1;
let size = 5;
let skip = (page - 1) * size;

let queryString= {...req.query};
const excludedQuery= ['page', 'sort', 'keyword', 'fields'];
excludedQuery.forEach((ele)=> {
  delete queryString[ele]
});

queryString= JSON.stringify(queryString);
queryString= queryString.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}`);
queryString= JSON.parse(queryString);

let mongooseQuery = Product.find(queryString).skip(+skip).limit(+size);

if(req.query.sort) {
  let sortedBy= req.query.sort.split(',').join(' ');
  mongooseQuery.sort(sortedBy)
}
*/
