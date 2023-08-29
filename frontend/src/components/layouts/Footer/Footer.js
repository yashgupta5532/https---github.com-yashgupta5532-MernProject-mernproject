import React from 'react'
import playStore from "../../../images/playStore.png"
// import logo from "../../../images/logo-color.png"
import './Footer.css'

const Footer = () => {
  return (
    <footer id='footer'>
        <div className="left-footer">
            <h1>Download Our App</h1>
            <p>E-commerce is a service based site for eco-friendly users</p>
            {/* <img src={logo} id='logo' alt="img" /> */}
            <img src={playStore} alt="img" />
        </div>
        <div className="mid-footer">
            <h1>E-COMMERCE SITE</h1>    
            <p>Best quality assurance is our priority</p>
            <p>CopyRight 2023 &copy;ALL RIGHTS RESERVED</p>
        </div>
        <div className="right-footer">
            <h3>Follow Us</h3>
            <div className="anchor">
            <a href="http://google.com" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="http://google.com" target="_blank" rel="noopener noreferrer">GithHub</a>
            <a href="http://google.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
        </div>
    </footer>
  )
}

export default Footer