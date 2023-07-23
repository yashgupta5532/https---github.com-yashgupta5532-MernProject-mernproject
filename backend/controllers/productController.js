const Product =require('../models/productModel')
const ErrorHandler =require('../utils/errorHandler')
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

//create product -->Admin
exports.createProduct=catchAsyncErrors(async (req,res)=>{

    req.body.user=req.user.id;
    
    const product=await Product.create(req.body);
    res.status(200).json({
        success:true,
        product
    })

})

//getAllProducts
exports.getAllProducts=catchAsyncErrors(async (req,res,next)=>{
    const resultPerPage =2;
    const productCount=await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    let products = await apiFeature.query;

    res.status(200).json({
        success:true,
        products,productCount
    })
})

//getProductDetails
exports.getProductDetails=catchAsyncErrors(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
       next(new ErrorHandler("product not found",500))
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


