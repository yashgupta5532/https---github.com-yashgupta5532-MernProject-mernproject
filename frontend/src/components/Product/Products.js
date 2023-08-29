import React, { Fragment,useEffect } from "react";
import "./Products.css";
import Loader from "../layouts/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productAction";
import ProductCard from '../Home/ProductCard'
import { useParams } from "react-router-dom";

const Products = () => {
    const dispatch =useDispatch();
    const { key } = useParams();
    const {products,loading,error,productsCount} =useSelector((state)=>state.products);
   useEffect(()=>{
    dispatch(getProduct(key));
   },[dispatch,key])
  return (
    <Fragment>
    {loading ? (
      <Loader />
    ) : (
      <Fragment>
        <h2 className="productHeading">Products</h2>
        <div className="products">
        {products && products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}</div>
      </Fragment>
    )}
  </Fragment>
  );
};

export default Products;
