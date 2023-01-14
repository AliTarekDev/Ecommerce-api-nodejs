const {Schema, model, Types}= require('mongoose');

const schema= Schema({
    code: {
        type: String,
        required: [true, 'coupon code required'],
        trim: true, //remove spaces
        unique: [true, 'coupon code must be unique'],
    },
    expires: {
        type: Date
    },

    discount: {
        type: Number
    }

},{
    timestamps: true
});

module.exports= model('coupon', schema)