import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import Loader from "../layouts/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { Slider, Typography } from "@mui/material";
import {useAlert} from 'react-alert'
import MetaData from "../layouts/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "machine",
  "sports",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 50000]);
  const [ratings, setRating] = useState(0);
  const keyword = useParams();
  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const [category, setCategory] = useState("");
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct(keyword, currentPage, price, category,ratings));
  }, [dispatch, keyword, currentPage, price, category,ratings,alert,error]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS-ECOMMERCE"/>
          <h2 className="productHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography variant="h6" style={{ fontWeight: "bold" }}>
              Price
            </Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={50000}
            />
            <Typography
              style={{ textDecoration: "underline", fontWeight: "bold" }}
            >
              Categories
            </Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {" "}
                  {category}
                </li>
              ))}
            </ul>
            <div className="rating">
              <fieldset>
                <Typography component="legend">Rating Above</Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRating) => {
                    setRating(newRating);
                  }}
                  // orientation="vertical"
                  valueLabelDisplay="auto"
                  aria-labelledby="continuous-slider"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>
          </div>

          {resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
