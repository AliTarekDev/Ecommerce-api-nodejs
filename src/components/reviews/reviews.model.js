const {Schema, model, Types}= require('mongoose');

const schema= Schema({
    title: {
        type: String,
        required: [true, 'title name required'],
        trim: true, //remove spaces
        minlength: [1, 'title name at least 1 chars']
    },

    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Types.ObjectId,
        ref: 'product'
    },
    rating: {
        type: Number,
        min: [1, 'ratingAverage must be greater than 1'],
        max: [5, 'ratingAverage must be less than 5']
    },
},{
    timestamps: true
});

schema.virtual('id').get(function() {
    return this._id.toHexString()
});

schema.set('toJSON', {
    virtuals: true
})
schema.pre(/^find/, function() {
    this.populate('user', 'name')
})

module.exports= model('review', schema)