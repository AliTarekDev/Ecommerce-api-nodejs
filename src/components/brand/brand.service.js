const Brand = require("../brand/brand.model");
const slugify = require("slugify");
const { checkAsyncError } = require("../../utils/catchAsync");
const AppError = require("../../utils/AppError");
// const cloudinary = require("cloudinary");
// cloudinary.config({
//   cloud_name: "dwjuqzxo4",
//   api_key: "895823372869496",
//   api_secret: "_QKMyzPBazihGQavFPLTLV7wvmY",
// });

exports.createBrand = checkAsyncError(async (req, res, next) => {
  // cloudinary.v2.uploader.upload(req.file.path, (error, result) => {
  //   console.log(result);
  // });
  const { name } = req.body;

  if (!req.file) return new AppError("No such File or image !", 404);

  let imagePath = `${req.protocol}://${req.get("host")}/uploads/brand/${
    req.file.filename
  }`;

  let brand = new Brand({ name, slug: slugify(name), image: imagePath });

  brand = await brand.save();

  !brand && next(new AppError("Cannot create Brand !", 404));
  brand && res.status(200).json({ message: "new Brand Created !", brand });
});

//To Get list of brands
exports.getBrandList = checkAsyncError(async (req, res, next) => {
  const brand = await Brand.find({});

  !brand && next(new AppError("Cannot Get Brand List!", 404));
  brand && res.status(200).json(brand);
});

//To Get Specific Brand
exports.getBrand = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let brand = await Brand.findById(id);

  !brand && next(new AppError("Cannot Get Brand !", 404));
  brand && res.status(200).json(brand);
});

//To Delete Specific Brand
exports.deleteBrand = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndRemove(id);

  !brand && next(new AppError("Cannot Get Brand !", 404));
  brand && res.status(200).json({ message: "Brand Deleted Successfully !" });
});

//To update Specific subCategory
exports.updateBrand = checkAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }

  let getBrand = await Brand.findById(id).select("image");

  let imagePath;
  if (req.file) {
    imagePath = `${req.protocol}://${req.get("host")}/uploads/brand/${
      req.file.filename
    }`;
  } else {
    imagePath = getBrand.image;
  }
  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, image: imagePath },
    { new: true }
  );
  !brand && next(new AppError("Cannot Get Brand !", 404));
  brand &&
    res.status(200).json({ message: "Brand Updated Successfully !", brand });
});
