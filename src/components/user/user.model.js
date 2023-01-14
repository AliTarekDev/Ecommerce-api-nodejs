const {Schema, model, Types}= require('mongoose');
const bcrypt = require("bcrypt");
const schema= Schema({
    name: {
        type: String,
        required: [true, 'user name required'],
        trim: true, //remove spaces
        minlength: [2, 'user name at least 2 chars']
    },

    email: {
        type: String,
        required: [true, 'user name required'],
        trim: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "password min length is 6"]
    },

    passwordCreatedAt: Date,

    profileImage: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    wishlist:[{
        type: Types.ObjectId,
        ref: 'product'
    }],

    addresses: [{
        name: String,
        street: String,
        city: String,
        phone: String
    }],

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

schema.pre('save',async function() {
    this.password= await bcrypt.hash(this.password, 8)
})
module.exports= model('User', schema)