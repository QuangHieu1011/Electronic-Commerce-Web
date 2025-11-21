import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style';


const SliderComponent = ({arrImages}) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        fade: true,
        cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };
  return (
    <WrapperSliderStyle {...settings}>
        {arrImages.map((image)=> {
            return (
                <Image 
                  key={image} 
                  src={image} 
                  alt="slider" 
                  preview={false} 
                  width="100%" 
                  height="400px"
                  style={{ objectFit: 'cover' }}
                />
            )
        })}
    </WrapperSliderStyle>
  )
}

export default SliderComponent