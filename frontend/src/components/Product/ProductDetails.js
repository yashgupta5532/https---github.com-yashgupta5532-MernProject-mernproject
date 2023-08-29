import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import ReactStars from "react-rating-stars-component";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";
import {useAlert} from 'react-alert';

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const alert =useAlert();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, product,alert ,error]);

  const options = {
    edit: false,
    color: "gray",
    activeColor: "tomato",
    size:window.innerWidth < 600 ? 20 :25,
    value: product.ratings,
    isHalf: true,
  };

  return (
    <Fragment>
      <div className="ProductDetails">
        <div>
          <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img
                  className="CarouselImage"
                  key={item.url}
                  src={item.url}
                  alt={`${i} slide`}
                />
              ))}
          </Carousel>
        </div>
        <div className="container">
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
            <p>Product Id: {product._id}</p>
          </div>
          <div className="detailsBlock-2">
            <ReactStars {...options} />
            <span>{product.numOfReviews} Reviews </span>
          </div>
          <div className="detailsBlock-3">
            <h1>Price : ₹{product.price}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button>-</button>
                <input type="number" value={1} />
                <button>+</button>
              </div>
              <button className="cart">Add to Cart</button>
            </div>
            <p>
              Status :{" "}
              <b className={product.stock < 1 ? "redColor" : "greenColor"}>
                {product.stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
          </div>
          <div className="detailsBlock-4">
            Description : <p>{product.description}</p>
          </div>
          <button className="submitReview">Submit Review</button>
        </div>
      </div>

      <h3 className="reviewHeading">Reviews</h3>
      {
        product.reviews && product.reviews[0]?(
          <div className="reviews">
            {product.reviews && product.reviews.map((review)=>
            <ReviewCard review ={review}/>
            )}
          </div>
        ):(
          <Typography variant="h4" className="noReviews">No Reviews Yet</Typography>
        )
      }
    </Fragment>
  );
};

export default ProductDetails;
