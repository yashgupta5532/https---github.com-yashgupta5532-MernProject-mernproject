import React, { Fragment, useState } from "react";
import "./Search.css";
import MetaData from "../layouts/MetaData";
import history from './History'
// import {useHistory} from "react-router-dom"

const Search = () => {
  // const history=useHistory();
  const [keyword, setKeyword] = useState("");
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
     history.push(`/products/${keyword}`)
    } else {
      history.push('/products')
    }
  };
  return (
    <Fragment>
      <MetaData title={`SEARCH A PRODUCT-ECOMMERCE`} />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a product..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </Fragment>
  );
};

export default Search;
