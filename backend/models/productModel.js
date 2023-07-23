const mongoose = require('mongoose')

const productSchema =new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product name"],
        trim:true
    },
    description: {
        type: String,
        required: [true, "Please Enter Product description"]
    },
    price: {
        type: Number,
        maxLength:[8,"cannot exceed 8 characters"],
        required: [true, "Please Enter Product price"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    rating:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
        required: true
    },
    stock:{
        type:Number,
        required:true,
        maxLength:[4,"cannot exceed 4 characters"]
    },
    noOfReviews: {
        type: Number,
    },
    reviews: [
        {
            name: {
                type: String,
                required: [true, "Please Enter your name"]
            },
            rating: {
                type: Number,
                required: true,
                default: 0
            },
            comments: {
                type: String,
            }
        }
    ],
    user:{  //one who create the website 
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);