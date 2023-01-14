const AppError = require("../../utils/AppError");
const { checkAsyncError } = require("../../utils/catchAsync");
const cartModel = require("./cart.model");
const cartItemsModel = require("./cartItems.model");

//Get Cart
exports.cartList = checkAsyncError(async (req, res, next) => {
  let cartItems = await cartModel.find({});

  !cartItems && next(new AppError("Can't get Cart List"));
  cartItems && res.status(200).json(cartItems);
});

//Get specific Cart
exports.getSpecificCart = checkAsyncError(async (req, res, next) => {
  let cartItem = await cartModel
    .findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "cartItems",
      populate: { path: "product", populate: "category" },
    });

    !cartItem && next(new AppError("can't Get Specific Cart !", 401));
    cartItem && res.status(200).json(cartItem)

});

//add To Cart
exports.addToCart = checkAsyncError(async (req, res, next) => {
  let cartItemsIds = Promise.all(
    req.body.cartItems.map(async (cartItem) => {
      let cartItems = new cartItemsModel({
        product: cartItem.product,
        quantity: cartItem.quantity,
      });

      cartItems = await cartItems.save();

      return cartItems._id;
    })
  );

  let cartItemsResolved = await cartItemsIds;

  let totalPrice = await Promise.all(
    cartItemsResolved.map(async (cartItem) => {
      let cartItems = await cartItemsModel
        .findById(cartItem)
        .populate("product", "price");

      let totalPrices = cartItems.product.price * cartItems.quantity;

      return totalPrices;
    })
  );

  let totalPriceResolved = totalPrice.reduce((acc, curr) => acc + curr, 0);

  let cart = new cartModel({
    cartItems: cartItemsResolved,
    user: req.user._id,
    totalPrice: totalPriceResolved,
    discount: req.body.discount,
  });

  cart = await cart.save();

  !cart && next(new AppError("Can't add cart"));

  cart && res.status(201).json({ message: "Cart Added Successfully !", cart });
});

//delete Cart
exports.deleteCart = checkAsyncError(async (req, res, next) => {
  let cart = await cartModel.findByIdAndRemove(req.params.id);

  if (cart) {
    await cart.cartItems.map(async (item) => {
      await cartItemsModel.findByIdAndRemove(item);
    });

    return res.status(200).json({ message: "Cart Deleted Successfuly !" });
  } else {
    return res.status(401).json({ message: "Can't Delete Cart !" });
  }
});

//Update Cart

exports.updateCartStatus= checkAsyncError(async (req,res,next)=> {

  const {status}= req.body;

  let cart= await cartModel.findByIdAndUpdate(req.params.id, {status}, {new: true});

  !cart && next(new AppError("Carnt Update Cart !"));
  cart && res.status(200).json({message: "Cart Updated !", cart})
})
