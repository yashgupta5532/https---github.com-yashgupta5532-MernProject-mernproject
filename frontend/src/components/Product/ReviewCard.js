import React from 'react'
import ReactStars from 'react-rating-stars-component'
import logo from '../../images/logo.png'
import { Typography } from '@mui/material';
import './ProductDetails.css'

const ReviewCard = ({review}) => {

    const options = {
        edit: false,
        color: "gray",
        activeColor: "tomato",
        size:window.innerWidth < 600 ? 20 :25,
        value: review.rating,
        isHalf: true,
      };

  return (
    <div className='reviewCard'>
        <img src={logo} alt="img" />
        <p>{review.name}</p>
        <ReactStars {...options} />
        <span>
            <Typography variant='h4'>{review.comment}</Typography>
        </span>
    </div>
  )
}

export default ReviewCard