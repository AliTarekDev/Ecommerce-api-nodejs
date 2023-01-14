const {Schema, model, Types}= require('mongoose');

const schema= Schema({
    name: {
        type: String,
        required: [true, 'subcategory name required'],
        trim: true, //remove spaces
        unique: [true, 'subcategory name must be unique'],
        minlength: [2, 'subcategory name at least 2 chars']
    },

    slug: {
        type: String,
        lowercase: true
    },
    
    category: {
        type: Types.ObjectId,
        ref: 'category'
    }
},{
    timestamps: true
});

module.exports= model('subcategory', schema)