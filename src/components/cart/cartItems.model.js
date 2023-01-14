const {Schema, model, Types}= require('mongoose');

const schema= Schema({
    product: {
        type: Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        required: true
    },
},{
    timestamps: true
});

module.exports= model('CartItem', schema)