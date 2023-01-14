const {Schema, model, Types}= require('mongoose');

const schema= Schema({
    name: {
        type: String,
        required: [true, 'category name required'],
        trim: true, //remove spaces
        unique: [true, 'category name must be unique'],
        minlength: [2, 'category name at least 2 chars']
    },

    slug: {
        type: String,
        lowercase: true
    },
    image: String
},{
    timestamps: true
});

module.exports= model('category', schema)