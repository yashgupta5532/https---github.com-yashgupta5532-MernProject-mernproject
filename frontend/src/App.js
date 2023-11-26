import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header/Header";
import webfont from "webfontloader";
import Footer from "./components/layouts/Footer/Footer";
import Home from "./components/Home/Home";
import ProductDetails from "./components/Product/ProductDetails";
import Products from "./components/Product/Products";
import Search from "./components/Product/Search";
import history from './components/Product/History'
import LoginSignUp from "./components/User/LoginSignUp";
import store from './store.js'
import { loadUser } from "./actions/userAction";
import UserOption from "./components/layouts/Header/UserOption";
import { useSelector } from "react-redux";
import Profile from "./components/User/Profile"
import UpdatedProfile from "./components/User/UpdatedProfile.js";
import UpdatePassword from "./components/User/UpdatePassword.js";
// import ProtectedRoute from "./components/Route/ProtectedRoute.js";

function App() {
  const {isAuthenticated,user} =useSelector(state=>state.user)
  React.useEffect(() => {
    webfont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser())
  }, []);

  return (
    <Router history={history}>
      <Header />
      {isAuthenticated && <UserOption user={user}/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products/>}/>
        <Route path="/products/:keyword" element={<Products/>}/>
        <Route path="/search" element={<Search />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/me/update" element={<UpdatedProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
        <Route path="/login" element={<LoginSignUp/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
