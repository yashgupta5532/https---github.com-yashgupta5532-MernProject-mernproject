const Product =require('../models/productModel')
const ErrorHandler =require('../utils/errorHandler')
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

//create product -->Admin
exports.createProduct=catchAsyncErrors(async (req,res)=>{

    req.body.user=req.user.id;
    // console.log(req.body.user)
    const product=await Product.create(req.body);
    // console.log(product)
    res.status(200).json({
        success:true,
        product
    })
})

//getAllProducts
exports.getAllProducts=catchAsyncErrors(async (req,res,next)=>{

    const resultPerPage = 8;
    const productsCount=await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    let products = await apiFeature.query;
    let filteredProductsCount=products.length
    // apiFeature.pagination(resultPerPage)
    // products = await apiFeature.query;

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    })
})

//getProductDetails
exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
       return next(new ErrorHandler("product not found",500))
    }
    res.status(200).json({
        success:true,
        product
    })
})

//update prdoucts
exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
        next(new ErrorHandler("product not found",500))
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidator:true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
})


//Delete product
exports.deleteProduct=catchAsyncErrors(async (req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        next(new ErrorHandler("product not found",500))
     }
    // await product.remove(); is depreciated
    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
})


//create new review or update the review

exports.createProductReview=catchAsyncErrors(async (req,res,next)=>{
    const {rating,comments,productId}=req.body;

    const review={
        name:req.user.name,
        user:req.user._id,
        rating:Number(rating),
        comments
    }
    const product=await Product.findById(productId)

    //finding user review in reviews
    const isReviewed=product.reviews.find((rev)=>{
        rev.user.toString() ===req.user._id.toString()
    })

    if(isReviewed){         //if already reviewed then update the user review
        product.reviews.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString()){
                rev.rating=rating,
                rev.comments=comments
            }
        })
    }
    else{           //push the above review object
        product.reviews.push(review)
        product.noOfReviews=product.reviews.length    //update  noOfReviews
    }
    let avg =0;
    product.reviews.forEach((rev)=>{
        avg +=rev.rating
    })
    product.ratings=avg/product.reviews.length  //avg rating

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })
})

//get all reviews of a product

exports.getAllProductReviews=catchAsyncErrors(async (req,res,next)=>{
    const product =await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("product not found",404))
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})


//delete reviews
exports.deleteReviews=catchAsyncErrors(async (req,res,next)=>{
    const product =await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("product not found",404))
    }

    const reviews=product.reviews.filter((rev)=>{
        rev._id.toString() !== req.query.id.toString()
    })

    let avg =0;
    reviews.forEach((rev)=>{
        avg +=rev.rating
    })
    const ratings=avg/reviews.length  //avg rating

    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidator:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
    })
})

