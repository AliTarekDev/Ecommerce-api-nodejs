const {Schema, model, Types}= require('mongoose');

const schema= Schema({
   cartItems: [
   {
    // productId: {
    //     type: Types.ObjectId,
    //     ref: 'product'
    // },
    // quantity: {
    //     type: Number,
    //     default: 1
    // },
    // price: Number
    type: Types.ObjectId,
    ref: 'CartItem'
   }
   ],

   user: {
    type: Types.ObjectId,
    ref: 'User'
   },
   totalPrice: Number,
   totalPriceAfterDiscount: Number,
   discount: Number,
   status: {
    type: Number,
    min: 0,
    max: 3,
    default: 0
   }
},{
    timestamps: true
});

module.exports= model('Cart', schema)