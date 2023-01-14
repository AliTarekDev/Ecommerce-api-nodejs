const {Schema, model}= require('mongoose');

const schema= Schema({
    name: {
        type: String,
        required: [true, 'brand name required'],
        trim: true, //remove spaces
        unique: [true, 'brand name must be unique'],
        minlength: [2, 'brand name at least 2 chars']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
},{
    timestamps: true
});
module.exports= model('brand', schema)