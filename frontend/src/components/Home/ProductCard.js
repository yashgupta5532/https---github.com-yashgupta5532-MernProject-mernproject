import React from 'react'
import { Link } from 'react-router-dom'
import ReactStars from 'react-rating-stars-component'


const Product = ({product}) => {

  const options={
    edit:false,
    color:"gray",
    activeColor:"tomato",
    value:product.ratings,
    isHalf:true
}

  return (
    <>
    <Link className='productCard' to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt="img" />
        <p>{product.name}</p>
        <div>
            <ReactStars {...options}/>
            <span>({product.numOfReviews})</span>
        </div>
        <span>{`₹${product.price}`}</span>
    </Link>
    </>
  )
}

export default Product