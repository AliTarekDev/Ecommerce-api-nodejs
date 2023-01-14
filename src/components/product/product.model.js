const {Schema, model, Types}= require('mongoose');

const schema= Schema({
    name: {
        type: String,
        required: [true, 'product name required'],
        trim: true, //remove spaces
        unique: [true, 'product name must be unique'],
        minlength: [2, 'product name at least 2 chars']
    },

    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true, //remove spaces
        minlength: [10, 'product name at least 2 chars']
    },
    quantity: {
        type: Number,
        required: [true, 'product quantity required'],
        default: 0

    },
    colors: [String],

    price: {
        type: Number,
        required: [true, 'product price required'],
    },
    priceAfterDiscount: {
        type: Number,
        required: [true, 'product price required'],
    },
    sold: {
        type: Number,
        required: [true, 'product price required'],
        default: 0
    },
    imageCover: String,
    images: [String],
    category: {
        type: Types.ObjectId,
        ref: 'category',
        required: true
    },

    subcategory: {
        type: Types.ObjectId,
        ref: 'subcategory',
        required: true
    },
    brand: {
        type: Types.ObjectId,
        ref: 'brand',
        required: true,
    },

    averageRating: {
        type: Number,
        min: [1, 'ratingAverage must be greater than 1'],
        max: [5, 'ratingAverage must be less than 5']
    },

    ratingCount: {
        type: Number,
        default: 0
    }

},{
    timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

schema.virtual('reviews', {
    ref: 'review',
    localField: '_id',
    foreignField: 'product'
});

schema.pre('findOne', function() {
    this.populate('reviews')
})

module.exports= model('product', schema)