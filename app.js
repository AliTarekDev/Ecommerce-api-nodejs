
process.on("uncaughtException", (err)=> {
   console.log(err);
})

const express= require('express');
const app= express();
require('dotenv').config({path: './config/.env'});
const morgan= require('morgan');
const categoryRouter= require('./src/components/category/category.api');
const subcategoryRouter= require('./src/components/subcategory/subcategory.api');
const brandRouter= require('./src/components/brand/brand.api');
const productRoute= require('./src/components/product/product.api');
const userRoute= require('./src/components/user/user.api');
const reviewRoute= require('./src/components/reviews/review.api');
const wishlistRoute= require('./src/components/wishlist/wishlist.api');
const addressRoute= require('./src/components/addresses/addresses.api');
const cartRoute= require('./src/components/cart/cart.api');
const gobalError= require('./src/utils/globalErorrMiddleware');
const { dbConnection } = require('./src/database/dbConnection');
const  AppError  = require('./src/utils/AppError');
const cors= require('cors');
//middleware
app.use(express.json());
app.use(cors())
require('dotenv').config();
if(process.env.NODE_ENV=== "development") {
    app.use(morgan('dev'))
}

app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/subcategory', subcategoryRouter);
app.use('/api/v1/brand', brandRouter);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/address', addressRoute);
app.use('/api/v1/cart', cartRoute);
app.use('/uploads/product', express.static(__dirname+ '/uploads/product'))
app.use('/uploads/category', express.static(__dirname+ '/uploads/category'))
app.use('/uploads/brand', express.static(__dirname+ '/uploads/brand'))
//handle unhandled routes
app.all('*', (req,res,next)=> {
    //res.status(404).json({message: `can't find this route: ${req.originalUrl} on this site`})

   // let err= new Error(`can't find this route: ${req.originalUrl} on this site`)
    next(new AppError(`can't find this route: ${req.originalUrl} on this site`, 404))
});



//Global error handle middleware
//catch any error comes from any next() f el donia
app.use(gobalError)
dbConnection()
const port= process.env.PORT;
app.listen(port, ()=> console.log(`Server Listened to port: ${port}`))

process.on("unhandledRejection", (err)=> {
    return new AppError("unhandledRejection", err)
})